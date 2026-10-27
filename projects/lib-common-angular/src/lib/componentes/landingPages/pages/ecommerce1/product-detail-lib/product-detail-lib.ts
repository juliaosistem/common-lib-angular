import { ChangeDetectorRef, Component, DestroyRef, OnInit, Input, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetalleCarrito1Component } from '../../../../shared/molecules/productos/detalle-carrito-1/detalle-carrito-1.component';
import { MetaDataService } from '../../../../../services/meta-data.service.ts/meta-data.service';
import { ProductoDTO,CategoriaDTO } from '@juliaosistem/core-dtos';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../../services/product.service';
import { Store } from '@ngxs/store';
import { ProductosActions, ProductosState } from '../../../../../assets/state/productos.state';
import { CardProductos1Component } from '../../../../shared/molecules/productos/card-productos1/card-productos1.component';
import { register } from 'swiper/element/bundle';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../../services/auth-service';
import { CartService } from '../../../../../services/cart.service';
import { AbstractLogger } from '../../../../../services/abstract-logger.service';

@Component({
  selector: 'lib-product-detail-lib',
  standalone: true,
  imports: [CommonModule, DetalleCarrito1Component, CardProductos1Component],
  templateUrl: './product-detail-lib.html',
  styleUrls: ['./product-detail-lib.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DetalleProductoPageLib implements OnInit {
  /**
   * Producto actual a mostrar en el detalle.
   * Puede llegar vía `@Input` o a través del `history.state`/ruta.
   */
  @Input() product: ProductoDTO | undefined;

  /**
   * Indica si el usuario está autenticado para habilitar acciones/visualizaciones para agregar al carrito.
   */
  @Input() isLogin = false;
  productError = '';
  private readonly cart = inject(CartService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly logger = inject(AbstractLogger);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly cartRequests$ = new Subject<{ product: ProductoDTO; quantity: number }>();

  /**
   * Lista de categorías disponibles. Se usa para enriquecer los productos
   * relacionados con el nombre de la categoría cuando el store no lo provee.
   */
  @Input() categorias: CategoriaDTO[] = [];

  /**
   * Productos relacionados (misma categoría) que se mostrarán en el slider.
   */
  products : ProductoDTO[] = [];

  /**
   * Configuración de breakpoints para el slider de productos relacionados.
   * - 768px: 2 productos por vista
   * - 1024px: 3 productos por vista
   */
  readonly breakpoints = {
    768: { slidesPerView: 2, spaceBetween: 16 },
    1024: { slidesPerView: 3, spaceBetween: 16 },
  };

  /** Número base de productos por vista (móvil). */
  readonly slidesPerViewBase = 1;
  /** Espacio base entre slides (px). */
  readonly spaceBetweenBase = 12;

  constructor(
    private route: ActivatedRoute,
    private productSvc: ProductService,
    private meta: MetaDataService,
    private store: Store,
  ) {}

  /**
   * - Registra los web components de Swiper (una sola vez).
   * - Resuelve el producto a mostrar y carga los relacionados.
   */
  ngOnInit(): void {
    try { register(); } catch { /* ya registrado */ }
    this.getData();
    this.auth.isLoggedIn$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(loggedIn => {
      this.isLogin = loggedIn;
      this.cdr.markForCheck();
    });
    this.cart.connectProductRequests(this.cartRequests$).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  /**
   * Obtiene el producto a mostrar:
   * 1. Prioriza `history.state` (navegación con estado).
   * 2. Si no está, intenta resolver por `id` en la URL:
   *    - Busca en el store NGXS
   *    - Si no existe, consulta el catalogo real.
   * Finalmente, carga los productos relacionados.
   */
  getData(): void{
    const nav = history.state as { product?: ProductoDTO };
    this.product ??= nav.product;
    if (this.product) {
      this.loadRelatedProducts();
      return;
    }
    const id = this.getProductIdFromRoute();
    if (!id) {
      this.productError = 'No se indicó un producto.';
      return;
    }
    this.product = this.getFromStoreById(id);
    if (this.product) this.loadRelatedProducts();
    else this.loadProduct(id);
  }

  /**
   * Resuelve el `id` del producto desde diferentes ubicaciones en la ruta:
   * - `paramMap`: `id` o `productId`
   * - `queryParamMap`: `id`
   * - Último segmento de la URL
   */
  private getProductIdFromRoute(): string | null {

    // Nueva ruta: /productos/:nombre/:idInflable
    let id = this.route.snapshot.paramMap.get('idInflable');
    if (id) {
      // Extraer solo el número o identificador antes de '-inflable'
      const match = id.match(/^([0-9a-zA-Z-]+)(?:-inflable)?$/);
      return match ? match[1] : id;
    }
    id = this.route.snapshot.paramMap.get('productId');
    if (id) return id;
    id = this.route.snapshot.queryParamMap.get('id');
    if (id) return id;
    const urlSegs = this.route.snapshot.url;
    if (urlSegs && urlSegs.length > 0) {
      return urlSegs[urlSegs.length - 1].path || null;
    }
    return null;
  }

  /**
   * Busca un producto por `id` en el store NGXS.
   * @param id Identificador del producto
   * @returns Producto si existe, `undefined` en caso contrario
   */
  private getFromStoreById(id: string): ProductoDTO | undefined {
    return (this.store.selectSnapshot(ProductosState.getProductos) ?? []).find(product => product.id === id);
  }

  /** @param id Identificador real; no sustituye errores o ausencias por productos ficticios. */
  private loadProduct(id: string): void {
    const params = this.meta.get('listar');
    this.store.dispatch(new ProductosActions.All({ ...params, idbusiness: Number(params.idbusiness) })).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        const response = this.store.selectSnapshot(ProductosState.getProductosResponse);
        this.product = this.getFromStoreById(id);
        this.productError = response.rta === false ? response.message || 'No se pudo cargar el producto.'
          : this.product ? '' : 'El producto no está disponible.';
        if (this.product) this.loadRelatedProducts();
        this.cdr.markForCheck();
      },
      error: (error: unknown) => {
        this.logger.logError(error, 'DetalleProductoPageLib.loadProduct');
        this.productError = 'No fue posible contactar el catálogo de productos.';
        this.cdr.markForCheck();
      },
    });
  }

  /** @param event Producto y cantidad seleccionados en el detalle o sus relacionados. */
  onAddToCart(event: { product: ProductoDTO; quantity: number }): void {
    this.cartRequests$.next(event);
  }

  /**
   * Construye la lista de productos relacionados por categoría.
   * - Obtiene los productos del catalogo cargado en el store.
   * - Filtra por `idCategoria` y excluye el producto actual.
   * - Enriquece los productos con `nombreCategoria` si es necesario.
   */
  private loadRelatedProducts(): void {
    if (!this.product?.idCategoria) {
      this.products = [];
      return;
    }
    const allProducts = this.store.selectSnapshot(ProductosState.getProductos) ?? [];
    const idCat = String(this.product.idCategoria);
    this.products = allProducts
      .filter(p => String(p.idCategoria) === idCat)
      .filter(p => String(p.id) !== String(this.product?.id));

    const cats = this.getCategoriasFromStoreOrInputOrMock();
    if (cats && cats.length) {
      this.products = this.productSvc.addNameCategoriaToProducts(this.products, cats);
    }
  }

  /**
   * Obtiene categorías desde distintas fuentes (prioridad):
   * 1. `@Input categorias`
   * 2. Store NGXS (`categoriaproducto.dataList`)
   * 3. Mock proporcionado por `ProductService`
   */
  private getCategoriasFromStoreOrInputOrMock(): CategoriaDTO[] {
    if (this.categorias && this.categorias.length) return this.categorias;
    try {
      const fromStore = this.store.selectSnapshot(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (state: any) => (state?.categoriaproducto?.dataList as CategoriaDTO[]) || []
      );
      if (fromStore && fromStore.length) return fromStore;
    } catch {
      // ignorar y usar mock
    }
    return this.productSvc.mockCategoriaInflablesDTO();
  }
}
