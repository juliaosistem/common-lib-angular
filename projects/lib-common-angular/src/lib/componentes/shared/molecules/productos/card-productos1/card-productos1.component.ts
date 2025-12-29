import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { PrimegModule } from '../../../../../modulos/primeg.module';
import { ImagenDTO, ProductoDTO } from '@juliaosistem/core-dtos';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { SectionAddCardsButtons } from "../../section-add-cards-buttons/section-add-cards-buttons";
import { IonicModule } from '@ionic/angular';

 type ProductoView = ProductoDTO & { nombreCategoria?: string };


@Component({
  selector: 'lib-card-productos1',
  standalone: true,
  templateUrl: './card-productos1.component.html',
  styleUrls: ['./card-productos1.component.scss'],
  imports: [CommonModule, PrimegModule, SectionAddCardsButtons,IonicModule],
  providers: [CurrencyPipe]
})
export class CardProductos1Component implements OnInit, OnDestroy {

  @Input() product!: ProductoView;
  @Output() addToCart = new EventEmitter<{ product: ProductoDTO, quantity: number }>();
  @Input() isLogin: boolean = false;
  // Ruta base configurable desde el frontal para navegar al detalle
  @Input() detailRouteBase: string[] = ['detalle'];

  discount = 0;
  currentImageIndex = 0;
  shareMenuOpen = false;
  private readonly shareBaseUrl = 'https://zigmainflables.com';
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  autoSlideInterval: any;

  constructor(
    private currencyPipe: CurrencyPipe,
    private productService: ProductService,
    private router: Router
  ) {}

  /**
   * Inicializa el componente calculando el descuento y
   * arrancando el carrusel de imágenes si el producto es válido.
   */
  ngOnInit(): void {
   if (this.productService.checkIsProductIsnotEmptyOrNull(this.product)) {
      this.discount = this.productService.calculateDiscount(this.product);
      this.startAutoSlide();
    }
  }

  /**
   * Limpia recursos al destruir el componente, deteniendo
   * el carrusel automático si está activo.
   */
  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  /**
   * Devuelve la imagen actualmente seleccionada para el producto.
   * @returns ImagenDTO imagen activa
   */
  get currentImage(): ImagenDTO {
    return this.product.imagen[this.currentImageIndex];
  }

  /**
   * Devuelve la URL de la imagen actualmente seleccionada.
   * @returns string URL de la imagen activa
   */
  get currentImageUrl(): string {
    return this.currentImage.url;
  }

  /**
   * Avanza a la siguiente imagen del carrusel, ciclando al inicio
   * cuando se alcanza el final.
   */
  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.product.imagen.length;
  }

  /**
   * Retrocede a la imagen anterior del carrusel, ciclando al final
   * cuando se está al inicio.
   */
  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.product.imagen.length) % this.product.imagen.length;
  }

  /**
   * Selecciona la imagen por índice dentro de la lista de imágenes del producto.
   * @param index Índice de la imagen a mostrar
   */
  selectImage(index: number): void {
    this.currentImageIndex = index;
  }

  /**
   * Indica si el índice recibido corresponde a la miniatura activa.
   * @param index Índice de miniatura a verificar
   * @returns boolean `true` si es la miniatura activa
   */
  isActiveThumbnail(index: number): boolean {
    return this.currentImageIndex === index;
  }

  /**
   * Inicia el carrusel automático de imágenes cambiando cada 3 segundos.
   */
  startAutoSlide(): void {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => this.nextImage(), 3000);
  }

  /**
   * Detiene el carrusel automático si está activo.
   */
  stopAutoSlide(): void {
    if (this.autoSlideInterval) clearInterval(this.autoSlideInterval);
  }

  /**
   * Emite el evento para agregar el producto al carrito con la cantidad indicada.
   * @param event Objeto con `{ product, quantity }`
   */
  onAddToCart(event: { product: ProductoDTO; quantity: number }) {
    this.addToCart.emit(event);
  }

  /**
   * Navega al detalle del producto construyendo la ruta a partir de `detailRouteBase`.
   * Acepta rutas absolutas (inician con `/`) o relativas y pasa el producto en `history.state`.
   */
navigateToProductDetail(): void {
  if (this.product?.id) {
      const parts = this.detailRouteBase
        .map(p => (p ? p.split('/') : []))
        .reduce((acc: string[], cur: string[]) => acc.concat(cur), [])
        .filter(seg => seg && seg.trim().length > 0);
      const isAbsolute = this.detailRouteBase[0]?.startsWith('/') || false;
      let basePrefix = '';
      if (!isAbsolute) {
        const currentPath = this.router.url.split('?')[0].split('#')[0];
        const firstSeg = currentPath.split('/').filter(Boolean)[0] || '';
        basePrefix = firstSeg ? `/${firstSeg}/` : '/';
      }
      const joined = [...parts, String(this.product.id)].join('/');
      const normalized = (isAbsolute ? '/' : basePrefix) + joined;
      this.router.navigateByUrl(normalized, {
        state: { product: this.product, isLogin: this.isLogin }
      });
  }
}


  /**
   * Abre WhatsApp para compartir información del producto con un mensaje
   * basado en si el usuario tiene sesión iniciada.
   */
  shareProductOnWhatsapp(): void {
    const url = this.shareBaseUrl;
    let text = '';

    if (this.isLogin) {
      const precio = this.currencyPipe.transform(this.discount, this.product.precios[0].codigo_iso, 'code');
      text = `¡Mira esto! ${this.product.name} por solo ${precio}`;
    } else {
      const id = this.product?.id ?? '';
      text = `Hola, estoy interesado en el producto Referencia ${id}: ${this.product.name}`;
    }

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  }
  /**
   * Alterna la visibilidad del menú flotante de compartir en redes.
   */
  toggleShareMenu(): void {
    this.shareMenuOpen = !this.shareMenuOpen;
  }

  /**
   * Acciones de compartir en redes sociales soportadas.
   * @param red Red a utilizar: `'whatsapp' | 'facebook' | 'instagram'`
   */
  touchRedes(red: 'whatsapp' | 'facebook' | 'instagram') {
    const url = this.shareBaseUrl;
    const name = this.product?.name ?? '';
    if (red === 'whatsapp') {
      const text = `Mira este producto: ${name} - ${url}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,'_blank');
    }
    if (red === 'facebook') {
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(fbUrl,'_blank','noopener');
    }
  }

}
