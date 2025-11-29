import { Component, OnInit, OnDestroy,  Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PrimegModule } from '../../../../../modulos/primeg.module';
import { ProductoDTO,ImagenDTO, ComponentesDTO } from '@juliaosistem/core-dtos';
import { Router } from '@angular/router';
import { ButtonAddToCard1 } from "../../../atoms/button-add-to-card1/button-add-to-card1";
import { ProductService } from '../../../services/product.service';


@Component({
  selector: 'lib-card-productos1',
  imports: [CommonModule, PrimegModule, ButtonAddToCard1],
  providers: [CurrencyPipe],
  templateUrl: './card-productos1.component.html',
  styleUrl: './card-productos1.component.scss',
  standalone: true
})
export class CardProductos1Component implements OnInit, OnDestroy {
  
  componente:ComponentesDTO = {
          id: 26,
          nombreComponente: 'lib-card-productos1',
          version: '1.0',
          descripcion: 'Componente card para mostrar productos'
        }

  @Input() 
  product!: ProductoDTO 

  discount: number = 0;
  currentImageIndex: number = 0;
 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  autoSlideInterval: any;



  constructor(private currencyPipe: CurrencyPipe, private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.checkIsProductExistsAndLoadData();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

/**
 * Verifica si el producto existe y carga los datos necesarios
 */
  checkIsProductExistsAndLoadData():void {
    if(this.productService.checkIsProductIsnotEmptyOrNull(this.product)){
      this.discount = this.productService.calculateDiscount(this.product);
      this.startAutoSlide();
    } else {
      this.discount = 0;
    }
  }
  
  get currentImage(): ImagenDTO {
    return this.product.imagen[this.currentImageIndex];
  }

  get currentImageUrl(): string {
    return this.currentImage.url;
  }

  
  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.product.imagen.length) % this.product.imagen.length;
  }

  nextImage(): void {
  
    this.currentImageIndex = (this.currentImageIndex + 1) % this.product.imagen.length;
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }

  isActiveThumbnail(index: number): boolean {
    return this.currentImageIndex === index;
  }

  startAutoSlide(): void {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      this.nextImage();
    }, 3000);
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  onMouseEnter(): void {
    this.stopAutoSlide();
  }

  onMouseLeave(): void {
    this.startAutoSlide();
  }




  shareProductOnWhatsapp(): void {
    const text = `¡Mira esto! ${this.product.name} por solo $${this.currencyPipe.transform(this.discount, this.product.precios[0].codigo_iso ,'code')}`;
    const url = window.location.href;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
    console.log('¡Compartiendo por WhatsApp!');
  }

  shareProduct(): void {
    console.log('¡Lógica de compartir aquí!');
  }

  /**
   * Navega al detalle del producto
   */
  navigateToProductDetail(): void {
    if (this.product?.id) {
      this.router.navigate(['/producto/detalle', this.product.id]);
    }
  }

}
