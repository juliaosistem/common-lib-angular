import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CarritoDTO, CarritoItemDTO, MonedaDTO, ProductoDTO } from '@juliaosistem/core-dtos';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { LibConfigService } from '../config/lib-config.service';

type RawCartResponse = PlantillaResponse<unknown> & {
  data?: unknown;
  dataList?: unknown[];
};

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly cartState = new BehaviorSubject<CarritoDTO | null>(null);
  private readonly loadingState = new BehaviorSubject<boolean>(false);
  private readonly errorState = new BehaviorSubject<string | null>(null);
  private readonly drawerState = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly http: HttpClient,
    private readonly config: LibConfigService,
  ) {}

  get cart$(): Observable<CarritoDTO | null> {
    return this.cartState.asObservable();
  }

  get loading$(): Observable<boolean> {
    return this.loadingState.asObservable();
  }

  get error$(): Observable<string | null> {
    return this.errorState.asObservable();
  }

  get drawerOpen$(): Observable<boolean> {
    return this.drawerState.asObservable();
  }

  openDrawer(): void {
    this.drawerState.next(true);
  }

  closeDrawer(): void {
    this.drawerState.next(false);
  }

  clearState(): void {
    this.cartState.next(null);
    this.errorState.next(null);
    this.drawerState.next(false);
  }

  loadCart(): Observable<CarritoDTO | null> {
    const userId = this.getUserId();
    if (!userId) {
      this.clearState();
      return of(null);
    }

    this.loadingState.next(true);
    this.errorState.next(null);
    return this.fetchCart(userId).pipe(
      tap((cart) => this.cartState.next(cart)),
      catchError((error) => {
        this.errorState.next(this.resolveErrorMessage(error, 'No se pudo cargar el carrito.'));
        this.cartState.next(null);
        return of(null);
      }),
      finalize(() => this.loadingState.next(false)),
    );
  }

  addOrUpdateProduct(product: ProductoDTO, quantity: number): Observable<CarritoDTO | null> {
    const userId = this.getUserId();
    if (!userId) {
      this.errorState.next('Debes iniciar sesión para usar el carrito.');
      return of(null);
    }

    const nextCart = this.buildCartSnapshot(product, quantity, userId);
    if (!nextCart) {
      return of(null);
    }

    return this.persistCart(nextCart, userId);
  }

  removeProduct(productId: string): Observable<CarritoDTO | null> {
    const currentCart = this.cartState.value;
    const userId = this.getUserId();
    if (!currentCart?.id || !userId) {
      return of(null);
    }

    const nextItems = currentCart.items.filter((item) => item.producto.id !== productId);
    if (!nextItems.length) {
      return this.deleteCart(currentCart.id);
    }

    const total = this.calculateTotal(nextItems);
    const nextCart: CarritoDTO = {
      ...currentCart,
      items: nextItems,
      total,
      monedaTotal: {
        ...currentCart.monedaTotal,
        precio: total,
      },
    };

    return this.persistCart(nextCart, userId);
  }

  private persistCart(cart: CarritoDTO, userId: string): Observable<CarritoDTO | null> {
    this.loadingState.next(true);
    this.errorState.next(null);

    const request = cart.id
      ? this.http.put<PlantillaResponse<unknown>>(`${this.getBaseUrl()}/${cart.id}`, cart)
      : this.http.post<PlantillaResponse<unknown>>(`${this.getBaseUrl()}/add`, cart);

    return request.pipe(
      switchMap(() => this.fetchCart(userId)),
      tap((savedCart) => {
        this.cartState.next(savedCart);
        this.drawerState.next(true);
      }),
      catchError((error) => {
        this.errorState.next(this.resolveErrorMessage(error, 'No se pudo actualizar el carrito.'));
        return of(null);
      }),
      finalize(() => this.loadingState.next(false)),
    );
  }

  private deleteCart(cartId: string): Observable<CarritoDTO | null> {
    this.loadingState.next(true);
    this.errorState.next(null);

    return this.http.delete<PlantillaResponse<unknown>>(`${this.getBaseUrl()}/${cartId}`).pipe(
      map(() => null),
      tap(() => this.cartState.next(null)),
      catchError((error) => {
        this.errorState.next(this.resolveErrorMessage(error, 'No se pudo limpiar el carrito.'));
        return of(null);
      }),
      finalize(() => this.loadingState.next(false)),
    );
  }

  private fetchCart(userId: string): Observable<CarritoDTO | null> {
    return this.http.get<RawCartResponse>(`${this.getBaseUrl()}/all`, {
      params: { idUsuario: userId },
    }).pipe(
      map((response) => this.normalizeCartResponse(response)),
    );
  }

  private buildCartSnapshot(product: ProductoDTO, quantity: number, userId: string): CarritoDTO | null {
    const currentCart = this.cartState.value;
    const nextItems = [...(currentCart?.items ?? [])];
    const productId = product?.id;

    if (!productId) {
      this.errorState.next('El producto seleccionado no tiene identificador válido.');
      return null;
    }

    const currency = this.resolveCurrency(product, currentCart?.monedaTotal);
    const productIndex = nextItems.findIndex((item) => item.producto.id === productId);
    if (quantity <= 0) {
      if (productIndex >= 0) {
        nextItems.splice(productIndex, 1);
      }
    } else {
      const nextItem: CarritoItemDTO = {
        producto: this.cloneProduct(product),
        cantidad: quantity,
        subtotal: Number(currency.precio ?? 0) * quantity,
        moneda: currency,
      };

      if (productIndex >= 0) {
        nextItems.splice(productIndex, 1, nextItem);
      } else {
        nextItems.push(nextItem);
      }
    }

    if (!nextItems.length && !currentCart?.id) {
      this.cartState.next(null);
      return null;
    }

    const total = this.calculateTotal(nextItems);
    return {
      id: currentCart?.id,
      idUsuario: userId,
      items: nextItems,
      total,
      monedaTotal: {
        ...currency,
        precio: total,
      },
      fechaCreacion: currentCart?.fechaCreacion,
      fechaActualizacion: currentCart?.fechaActualizacion,
    };
  }

  private normalizeCartResponse(response: RawCartResponse): CarritoDTO | null {
    const carts = this.extractCarts(response);
    if (!carts.length) {
      return null;
    }

    const selectedCart = [...carts].sort((left, right) => {
      const leftDate = new Date(left?.fechaActualizacion ?? left?.fechaCreacion ?? 0).getTime();
      const rightDate = new Date(right?.fechaActualizacion ?? right?.fechaCreacion ?? 0).getTime();
      return rightDate - leftDate;
    })[0];

    return this.normalizeCart(selectedCart);
  }

  private extractCarts(response: RawCartResponse): any[] {
    if (Array.isArray(response?.dataList)) {
      return response.dataList;
    }
    if (Array.isArray(response?.data)) {
      return response.data;
    }
    if (response?.data) {
      return [response.data];
    }
    return [];
  }

  private normalizeCart(rawCart: any): CarritoDTO {
    const items = Array.isArray(rawCart?.items)
      ? rawCart.items.map((item: any) => this.normalizeCartItem(item))
      : [];
    const total = Number(rawCart?.total ?? this.calculateTotal(items));
    const fallbackCurrency = items[0]?.moneda ?? this.emptyCurrency();

    return {
      id: rawCart?.id,
      idUsuario: String(rawCart?.idUsuario ?? ''),
      items,
      total,
      monedaTotal: this.normalizeCurrency(rawCart?.monedaTotal, fallbackCurrency, total),
      fechaCreacion: rawCart?.fechaCreacion,
      fechaActualizacion: rawCart?.fechaActualizacion,
    };
  }

  private normalizeCartItem(rawItem: any): CarritoItemDTO {
    const product = this.normalizeProduct(rawItem?.producto);
    const subtotal = Number(rawItem?.subtotal ?? 0);

    return {
      producto: product,
      cantidad: Number(rawItem?.cantidad ?? 0),
      subtotal,
      moneda: this.normalizeCurrency(rawItem?.moneda, product.precios[0], subtotal),
    };
  }

  private normalizeProduct(rawProduct: any): ProductoDTO {
    return {
      id: rawProduct?.id,
      name: rawProduct?.name ?? '',
      precios: this.normalizePrices(rawProduct?.precios),
      descuento: Number(rawProduct?.descuento ?? 0),
      cantidad: Number(rawProduct?.cantidad ?? 0),
      idBusiness: rawProduct?.idBusiness ?? rawProduct?.business?.id,
      idCategoria: String(rawProduct?.idCategoria ?? ''),
      nombreCategoria: rawProduct?.nombreCategoria,
      imagen: Array.isArray(rawProduct?.imagen) ? rawProduct.imagen : [],
      estado: rawProduct?.estado ?? 'ACTIVO',
      descripcion: rawProduct?.descripcion ?? '',
      comision: Number(rawProduct?.comision ?? 0),
      fechaCreacion: rawProduct?.fechaCreacion,
      fechaActualizacion: rawProduct?.fechaActualizacion,
      idDatosUsuario: rawProduct?.idDatosUsuario ?? '',
    };
  }

  private normalizePrices(rawPrices: any): MonedaDTO[] {
    if (!Array.isArray(rawPrices)) {
      return [];
    }

    return rawPrices.map((price) => this.normalizeCurrency(price?.moneda ? price.moneda : price, price, price?.precio));
  }

  private normalizeCurrency(rawCurrency: any, fallback?: Partial<MonedaDTO>, amount?: number): MonedaDTO {
    if (rawCurrency?.moneda) {
      return {
        id: rawCurrency.moneda?.id,
        codigo_iso: rawCurrency.moneda?.codigo_iso ?? fallback?.codigo_iso ?? 'COP',
        nombreMoneda: rawCurrency.moneda?.nombreMoneda ?? fallback?.nombreMoneda ?? 'Peso colombiano',
        precio: Number(rawCurrency?.precio ?? amount ?? fallback?.precio ?? 0),
      };
    }

    return {
      id: rawCurrency?.id ?? fallback?.id,
      codigo_iso: rawCurrency?.codigo_iso ?? fallback?.codigo_iso ?? 'COP',
      nombreMoneda: rawCurrency?.nombreMoneda ?? fallback?.nombreMoneda ?? 'Peso colombiano',
      precio: Number(rawCurrency?.precio ?? amount ?? fallback?.precio ?? 0),
    };
  }

  private resolveCurrency(product: ProductoDTO, fallback?: MonedaDTO): MonedaDTO {
    return this.normalizeCurrency(product?.precios?.[0], fallback, product?.precios?.[0]?.precio);
  }

  private calculateTotal(items: CarritoItemDTO[]): number {
    return items.reduce((accumulator, item) => accumulator + Number(item.subtotal ?? 0), 0);
  }

  private cloneProduct(product: ProductoDTO): ProductoDTO {
    return {
      ...product,
      precios: [...(product?.precios ?? [])],
      imagen: [...(product?.imagen ?? [])],
    };
  }

  private emptyCurrency(): MonedaDTO {
    return {
      codigo_iso: 'COP',
      nombreMoneda: 'Peso colombiano',
      precio: 0,
    };
  }

  private getBaseUrl(): string {
    return this.config.get<string>('baseUrlCarrito') || 'http://localhost:3000/carrito';
  }

  private getUserId(): string | null {
    if (!this.isBrowser()) {
      return null;
    }

    return sessionStorage.getItem('idDatosUsuario');
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
  }

  private resolveErrorMessage(error: any, fallback: string): string {
    return error?.error?.message || error?.message || fallback;
  }
}