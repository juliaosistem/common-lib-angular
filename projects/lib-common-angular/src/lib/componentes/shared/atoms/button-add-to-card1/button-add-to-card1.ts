import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ComponentesDTO, ProductoDTO } from '@juliaosistem/core-dtos';
import { CommonModule } from '@angular/common';
import { PrimegModule } from '../../../../modulos/primeg.module';

@Component({
  selector: 'lib-button-add-to-card1',
  imports: [CommonModule, PrimegModule],
  templateUrl: './button-add-to-card1.html',
  styleUrl: './button-add-to-card1.scss',
  standalone: true
})
export class ButtonAddToCard1 {

  @Input() product!: ProductoDTO;

  @Output() addToCart = new EventEmitter<{ product: ProductoDTO; quantity: number }>();

  componente: ComponentesDTO = {
    id: 25,
    nombreComponente: 'lib-button-add-to-card1',
    version: '1.0',
  };

  showQuantitySelector: boolean = false;
  selectedQuantity: number = 0;

  handleAddToCart(): void {
    this.selectedQuantity = 1;
    this.showQuantitySelector = true;

    this.emitAddToCart();
  }

  incrementQuantity(): void {
    if (this.selectedQuantity < (this.product?.cantidad ?? 0)) {
      this.selectedQuantity++;
      this.emitAddToCart();
    }
  }

  decrementQuantity(): void {
    if (this.selectedQuantity > 0) {
      this.selectedQuantity--;

      if (this.selectedQuantity === 0) {
        this.showQuantitySelector = false;
      }

      this.emitAddToCart();
    }
  }

  private emitAddToCart(): void {
    this.addToCart.emit({
      product: this.product,
      quantity: this.selectedQuantity
    });
  }
}
