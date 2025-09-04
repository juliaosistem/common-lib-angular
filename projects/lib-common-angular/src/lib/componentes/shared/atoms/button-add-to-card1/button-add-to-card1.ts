import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ComponentesDTO, ProductoDTO } from '@juliaosistem/core-dtos';
import { PrimegModule } from '../../../../modulos/primeg.module'

@Component({
  selector: 'lib-button-add-to-card1',
  imports: [CommonModule, PrimegModule],
  templateUrl: './button-add-to-card1.html',
  styleUrl: './button-add-to-card1.scss'
})
export class ButtonAddToCard1 {

  @Input()
  product!: ProductoDTO;

  componente:ComponentesDTO = {
        id: 25,
        nombreComponente: 'lib-button-add-to-card1',
        version: '1.0',
      }

  showQuantitySelector: boolean = false;
   selectedQuantity: number = 0;

  handleAddToCart(): void {
    this.selectedQuantity = 1;
    this.showQuantitySelector = true;
    console.log(`Producto agregado al carrito. Cantidad: ${this.selectedQuantity}`);
  }

    incrementQuantity(): void {
    if (this.selectedQuantity < (this.product?.cantidad ?? 0)) {
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
}
