import { ProductoDTO } from '@juliaosistem/core-dtos';
import { Component, Input } from '@angular/core';
import { ShWatsButtonCard } from "../../atoms/sh-wats-button-card/sh-wats-button-card";
import { ButtonAddToCard1 } from "../../atoms/button-add-to-card1/button-add-to-card1";

@Component({
  selector: 'lib-section-add-cards-buttons',
  imports: [ShWatsButtonCard, ButtonAddToCard1],
  templateUrl: './section-add-cards-buttons.html',
  styleUrl: './section-add-cards-buttons.scss',
})
export class SectionAddCardsButtons {

  @Input() product!: ProductoDTO;
  @Input() isLogin: boolean = false;

  onAddToCart(event: { product: ProductoDTO; quantity: number }): void {
    // Aquí puedes manejar el evento de agregar al carrito si es necesario
    console.log('Producto agregado al carrito:', event);
  }

}
