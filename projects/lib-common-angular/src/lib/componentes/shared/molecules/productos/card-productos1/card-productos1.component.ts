import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { PrimegModule } from '../../../../../modulos/primeg.module';
import { ProductoDTO, ImagenDTO } from '@juliaosistem/core-dtos';
import { Router } from '@angular/router';
import { ButtonAddToCard1 } from "../../../atoms/button-add-to-card1/button-add-to-card1";
import { ProductService } from '../../../services/product.service';
import { StyleClass } from "primeng/styleclass";

@Component({
  selector: 'lib-card-productos1',
  standalone: true,
  templateUrl: './card-productos1.component.html',
  styleUrls: ['./card-productos1.component.scss'],
  imports: [CommonModule, PrimegModule, ButtonAddToCard1, StyleClass],
  providers: [CurrencyPipe]
})
export class CardProductos1Component implements OnInit, OnDestroy {

  @Input() product!: ProductoDTO;
  @Output() addToCart = new EventEmitter<{ product: ProductoDTO, quantity: number }>();

  discount = 0;
  currentImageIndex = 0;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  autoSlideInterval: any;

  constructor(
    private currencyPipe: CurrencyPipe,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.productService.checkIsProductIsnotEmptyOrNull(this.product)) {
      this.discount = this.productService.calculateDiscount(this.product);
      this.startAutoSlide();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  get currentImage(): ImagenDTO {
    return this.product.imagen[this.currentImageIndex];
  }

  get currentImageUrl(): string {
    return this.currentImage.url;
  }

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.product.imagen.length;
  }

  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.product.imagen.length) % this.product.imagen.length;
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }

  isActiveThumbnail(index: number): boolean {
    return this.currentImageIndex === index;
  }

  startAutoSlide(): void {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => this.nextImage(), 3000);
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) clearInterval(this.autoSlideInterval);
  }

  onAddToCart(event: { product: ProductoDTO; quantity: number }) {
    this.addToCart.emit(event);
  }

navigateToProductDetail(): void {
  if (this.product?.id) {
    // ruta absoluta dentro de la librería host
    this.router.navigate(['/pages/ecommerce1/personalizar', this.product.id]);
  }
}


  shareProductOnWhatsapp(): void {
    const text = `¡Mira esto! ${this.product.name} por solo ${this.currencyPipe.transform(this.discount, this.product.precios[0].codigo_iso, 'code')}`;
    const url = window.location.href;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  }

  shareProduct(): void {
    console.log("Compartir...");
  }
}
