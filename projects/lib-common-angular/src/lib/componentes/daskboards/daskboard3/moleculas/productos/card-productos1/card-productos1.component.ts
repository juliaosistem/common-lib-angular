import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimegModule } from '../../../../../../modulos/primeg.module';

interface ProductImage {
  url: string;
  color: string;
}

interface Product {
  name: string;
  brand: string;
  oldPrice: number;
  price: number;
  category: string;
  stock: number;
  images: ProductImage[];
}

@Component({
  selector: 'lib-card-productos1',
  imports: [CommonModule, PrimegModule],
  templateUrl: './card-productos1.component.html',
  styleUrl: './card-productos1.component.scss',
  standalone: true
})
export class CardProductos1Component implements OnInit, OnDestroy {

  product: Product = {
    name: "Maleta Viaje Mediana Con Ruedas Resistente Moderna 20-22kg",
    brand: "Under Armour",
    oldPrice: 350000,
    price: 262500,
    category: "Viajes y equipaje",
    stock: 15,
    images: [
      { url: 'https://placehold.co/600x600/F5C7A5/000?text=Maleta+Rosa', color: 'Rosa' },
      { url: 'https://placehold.co/600x600/F0E68C/000?text=Maleta+Beige', color: 'Beige' },
      { url: 'https://placehold.co/600x600/36454F/FFF?text=Maleta+Negra', color: 'Negra' },
      { url: 'https://placehold.co/600x600/E94E5A/FFF?text=Maleta+Roja', color: 'Roja' },
      { url: 'https://placehold.co/600x600/1E3A8A/FFF?text=Maleta+Azul', color: 'Azul' }
    ]
  };

  currentImageIndex: number = 0;
  selectedQuantity: number = 0;
  autoSlideInterval: any;
  discount: number = 0;
  installmentPrice: string = '';
  showQuantitySelector: boolean = false;

  ngOnInit(): void {
    this.calculateDiscount();
    this.calculateInstallmentPrice();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  get currentImage(): ProductImage {
    return this.product.images[this.currentImageIndex];
  }

  get currentImageUrl(): string {
    return this.currentImage.url;
  }

  get currentColor(): string {
    return this.currentImage.color;
  }

  calculateDiscount(): void {
    this.discount = Math.round(100 - (this.product.price / this.product.oldPrice) * 100);
  }

  calculateInstallmentPrice(): void {
    const installment = (this.product.price / 3).toLocaleString('es-CO', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
    this.installmentPrice = installment;
  }

  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.product.images.length) % this.product.images.length;
  }

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.product.images.length;
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

  handleAddToCart(): void {
    this.selectedQuantity = 1;
    this.showQuantitySelector = true;
    console.log(`Producto agregado al carrito. Cantidad: ${this.selectedQuantity}`);
  }

  incrementQuantity(): void {
    if (this.selectedQuantity < this.product.stock) {
      this.selectedQuantity++;
    } else {
      console.log('No hay más stock disponible.');
    }
  }

  decrementQuantity(): void {
    if (this.selectedQuantity > 0) {
      this.selectedQuantity--;
      if (this.selectedQuantity === 0) {
        this.showQuantitySelector = false;
      }
    }
  }

  shareProductOnWhatsapp(): void {
    const text = `¡Mira esta maleta! ${this.product.name} por solo $${this.formatPrice(this.product.price)}.`;
    const url = window.location.href;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
    console.log('¡Compartiendo por WhatsApp!');
  }

  shareProduct(): void {
    console.log('¡Lógica de compartir aquí!');
  }

  formatPrice(price: number): string {
    return price.toLocaleString('es-CO');
  }
}
