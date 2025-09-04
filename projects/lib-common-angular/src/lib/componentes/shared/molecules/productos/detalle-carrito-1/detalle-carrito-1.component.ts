import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimegModule } from '../../../../../modulos/primeg.module';
import { FormsModule } from '@angular/forms';

interface Product {
  name: string;
  oldPrice: number;
  price: number;
  rating: number;
  reviews: number;
  description: string;
  images: string[];
}

@Component({
  selector: 'lib-detalle-carrito-1',
  imports: [CommonModule, PrimegModule,FormsModule],
  templateUrl: './detalle-carrito-1.component.html',
  styleUrl: './detalle-carrito-1.component.scss',
  standalone: true
})
export class DetalleCarrito1Component implements OnInit {
  
  product: Product = {
    name: 'Maleta Viaje Mediana Con Ruedas Resistente Moderna 20-22kg',
    oldPrice: 350000,
    price: 262500,
    rating: 5,
    reviews: 1,
    description: 'Una maleta de viaje robusta y moderna, perfecta para tus próximas vacaciones. Cuenta con ruedas de 360 grados y un candado de seguridad.',
    images: [
      'https://placehold.co/600x600/F5C7A5/000?text=Maleta+Rosa',
      'https://placehold.co/600x600/F0E68C/000?text=Maleta+Beige',
      'https://placehold.co/600x600/36454F/FFF?text=Maleta+Negra',
      'https://placehold.co/600x600/E94E5A/FFF?text=Maleta+Roja',
      'https://placehold.co/600x600/1E3A8A/FFF?text=Maleta+Azul'
    ]
  };

  currentQuantity: number = 1;
  selectedImageUrl: string = '';
  discount: number = 0;
  showCartMessage: boolean = false;
  isFavorite: boolean = false;

  ngOnInit(): void {
    this.selectedImageUrl = this.product.images[0];
    this.discount = Math.round(100 - (this.product.price / this.product.oldPrice) * 100);
  }

  updateMainImage(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
  }

  decrementQuantity(): void {
    if (this.currentQuantity > 1) {
      this.currentQuantity--;
    }
  }

  incrementQuantity(): void {
    this.currentQuantity++;
  }

  addToCart(): void {
    this.showCartMessage = true;
    setTimeout(() => {
      this.showCartMessage = false;
    }, 3000);
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
  }

  isActiveThumbnail(imageUrl: string): boolean {
    return this.selectedImageUrl === imageUrl;
  }

  formatPrice(price: number): string {
    return `$${price.toLocaleString('es-CO')}`;
  }
}
