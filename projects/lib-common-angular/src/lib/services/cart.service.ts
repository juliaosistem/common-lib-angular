import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { CarritoDTO, CarritoItemDTO, ProductoDTO } from '@juliaosistem/core-dtos';
import { Observable, catchError, concatMap, defer, distinctUntilChanged, map, of, switchMap } from 'rxjs';
import { QueryParams } from 'juliaositembackenexpress/dist/utils/queryParams';
import { CarritoState, CarritoViewState } from '../assets/state/carrito.state';
import { CarritoActions, CarritoUi, ConfirmarCarrito, LoadMediosPagos, ResetCarrito } from '../assets/state/carrito.actions';
import { getSessionBusinessClaims } from '../utils/business-token.util';
import { AbstractLogger } from './abstract-logger.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from './auth-service';
import { ProductService } from './product.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly logger = inject(AbstractLogger);
  private readonly auth = inject(AuthService);
  private readonly products = inject(ProductService);
  readonly state$ = this.store.select(CarritoState.getCarritoView);
  readonly cart$ = this.state$.pipe(map(state => state.data ?? null), distinctUntilChanged());
  readonly loading$ = this.state$.pipe(map(state => state.loading), distinctUntilChanged());
  readonly error$ = this.state$.pipe(map(state => state.rta ? null : state.message), distinctUntilChanged());
  readonly drawerOpen$ = this.state$.pipe(map(state => state.drawerOpen), distinctUntilChanged());

  constructor() {
    this.auth.isLoggedIn$.pipe(map(loggedIn => {
      const claims = getSessionBusinessClaims();
      return loggedIn ? `${claims?.['idBusiness'] ?? claims?.idbusiness}:${claims?.id}` : null;
    }), distinctUntilChanged(), takeUntilDestroyed()).subscribe(() => this.clearState());
  }

  openDrawer(): void {
    this.store.dispatch(new CarritoUi({ drawerOpen: true }));
    if (!this.snapshot().loading) this.loadCart().subscribe();
  }

  closeDrawer(): void {
    this.store.dispatch(new CarritoUi({ drawerOpen: false }));
  }

  clearState(): void {
    this.store.dispatch(new ResetCarrito());
  }

  loadCart(): Observable<CarritoDTO | null> {
    return this.result(this.store.dispatch(new CarritoActions.All(this.params())));
  }

  /** @param requests Cambios de cantidad del catalogo, aplicados en orden sin perder clics rapidos. */
  connectProductRequests(requests: Observable<{ product: ProductoDTO; quantity: number }>): Observable<CarritoDTO | null> {
    return requests.pipe(concatMap(request => this.addOrUpdateProduct(request.product, request.quantity)));
  }

  /** @param product Producto de catalogo. @param quantity Cantidad absoluta deseada. */
  addOrUpdateProduct(product: ProductoDTO, quantity: number): Observable<CarritoDTO | null> {
    return this.result(defer(() => {
      this.requireSession();
      this.requireIdle();
      return this.store.dispatch(new CarritoActions.All(this.params())).pipe(
        switchMap(() => this.persistProduct(product, quantity)),
      );
    }));
  }

  /** @param productId Identificador de la linea a retirar; el ultimo item elimina el carrito. */
  removeProduct(productId: string): Observable<CarritoDTO | null> {
    return this.removeProducts([productId]);
  }

  /** @param productIds Lineas seleccionadas; se persisten en una sola operacion. */
  removeProducts(productIds: string[]): Observable<CarritoDTO | null> {
    return this.result(defer(() => {
      this.requireSession();
      this.requireIdle();
      const cart = this.snapshot().data;
      if (!cart?.id) throw new Error('No hay un carrito cargado para modificar.');
      return this.saveItems(cart, cart.items.filter(item => !productIds.includes(item.producto.id ?? '')));
    }));
  }

  /** @param item Linea existente. @param quantity Cantidad nueva sin cambiar el precio persistido. */
  updateQuantity(item: CarritoItemDTO, quantity: number): Observable<CarritoDTO | null> {
    const product = { ...item.producto, descuento: 0, precios: [{ ...item.moneda, precio: item.subtotal / item.cantidad }] };
    return this.addOrUpdateProduct(product, quantity);
  }

  loadPaymentMethods(): Observable<CarritoDTO | null> {
    return this.result(this.store.dispatch(new LoadMediosPagos()));
  }

  getItem(productId: string): CarritoItemDTO | undefined {
    return this.snapshot().data?.items.find(item => item.producto.id === productId);
  }

  /** @param medioPagoId Medio seleccionado. No registra un pago aprobado ni vacia el carrito. */
  confirm(medioPagoId: string): Observable<CarritoDTO | null> {
    return this.result(defer(() => {
      this.requireSession();
      this.requireIdle();
      return this.store.dispatch(new ConfirmarCarrito(medioPagoId));
    }));
  }

  private persistProduct(product: ProductoDTO, quantity: number) {
    const cart = this.snapshot().data;
    this.validateProduct(product, quantity);
    const items = (cart?.items ?? []).filter(item => item.producto.id !== product.id);
    if (quantity > 0) items.push(this.buildItem(product, quantity));
    if (cart) return this.saveItems(cart, items);
    if (!items.length) return of(null);
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const payload: CarritoDTO = {
      idUsuario: String(getSessionBusinessClaims()?.id), items, total,
      monedaTotal: { ...items[0].moneda, precio: total },
    };
    return this.store.dispatch(new CarritoActions.Add(payload, this.params()));
  }

  private saveItems(cart: CarritoDTO, items: CarritoItemDTO[]) {
    if (!items.length) return this.store.dispatch(new CarritoActions.Delete({ ...this.params(), id: cart.id }));
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const payload = { ...cart, items, total, monedaTotal: { ...cart.monedaTotal, precio: total } };
    return this.store.dispatch(new CarritoActions.Update(payload, this.params()));
  }

  private buildItem(product: ProductoDTO, quantity: number): CarritoItemDTO {
    const currencyCode = this.snapshot().data?.monedaTotal.codigo_iso;
    const moneda = product.precios.find(price => !currencyCode || price.codigo_iso === currencyCode);
    if (!moneda) throw new Error('No se pueden mezclar monedas en el mismo carrito.');
    const unitPrice = Number(this.products.calculateDiscount({ ...product, precios: [moneda] }));
    return { producto: product, cantidad: quantity, subtotal: unitPrice * quantity, moneda: { ...moneda, precio: unitPrice } };
  }

  private validateProduct(product: ProductoDTO, quantity: number): void {
    if (!product.id || !Number.isInteger(quantity) || quantity < 0) {
      throw new Error('El producto y la cantidad deben ser válidos.');
    }
    if (quantity === 0) return;
    const discount = Number(product.descuento ?? 0);
    if (!Number.isFinite(discount) || discount < 0 || discount > 100) throw new Error('El descuento del producto no es válido.');
    const currencyCode = this.snapshot().data?.monedaTotal.codigo_iso;
    const price = product.precios?.find(value => !currencyCode || value.codigo_iso === currencyCode);
    if (!price?.id || !price.codigo_iso || !Number.isFinite(Number(price.precio)) || Number(price.precio) <= 0) {
      throw new Error('El producto no tiene un precio y una moneda válidos para este carrito.');
    }
    if (Number.isFinite(Number(product.cantidad)) && quantity > Number(product.cantidad)) {
      throw new Error('La cantidad solicitada supera las existencias disponibles.');
    }
  }

  private result(request: Observable<unknown>): Observable<CarritoDTO | null> {
    return request.pipe(map(() => this.snapshot().data ?? null), catchError((error: unknown) => {
      const message = error instanceof Error ? error.message : 'No fue posible actualizar el carrito.';
      this.logger.logError(new Error(message), 'CartService');
      this.store.dispatch(new CarritoUi({ message, rta: false, drawerOpen: true }));
      return of(null);
    }));
  }

  private snapshot(): CarritoViewState {
    return this.store.selectSnapshot(CarritoState.getCarritoView);
  }

  private requireIdle(): void {
    if (this.snapshot().loading) throw new Error('Espera a que termine la operación actual del carrito.');
  }

  private requireSession(): void {
    const claims = getSessionBusinessClaims();
    if (!claims?.id || !claims.exp || claims.exp * 1000 <= Date.now()) {
      this.router.navigate(['/home/login']);
      throw new Error('Debes iniciar sesión para usar el carrito.');
    }
    if (!Number(claims['idBusiness'] ?? claims.idbusiness)) {
      throw new Error('La sesión no contiene un negocio válido.');
    }
  }

  private params(): QueryParams {
    const claims = getSessionBusinessClaims();
    return { ip: '', dominio: 'ecommerce', usuario: String(claims?.usuario ?? claims?.id ?? ''),
      idbusiness: Number(claims?.['idBusiness'] ?? claims?.idbusiness), proceso: 'guardar', topic: 'carrito' };
  }
}
