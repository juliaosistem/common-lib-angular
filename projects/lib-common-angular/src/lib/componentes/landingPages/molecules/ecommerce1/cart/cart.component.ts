import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoDTO } from '@juliaosistem/core-dtos';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'lib-cart',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  @Input() cartItems: { product: ProductoDTO, quantity: number }[] = [];

  get total() {
    return this.cartItems.reduce((acc, item) => acc + (item.product.precios[0].precio * item.quantity), 0);
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
  }
}
