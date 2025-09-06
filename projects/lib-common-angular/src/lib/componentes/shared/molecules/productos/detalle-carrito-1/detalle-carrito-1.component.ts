import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimegModule } from '../../../../../modulos/primeg.module';
import { FormsModule } from '@angular/forms';
import { ComponentesDTO,ProductoDTO } from '@juliaosistem/core-dtos';
import { ButtonAddToCard1 } from "../../../atoms/button-add-to-card1/button-add-to-card1";
import { ProductService } from '../../../services/product.service';



@Component({
  selector: 'lib-detalle-carrito-1',
  imports: [CommonModule, PrimegModule, FormsModule, ButtonAddToCard1],
  templateUrl: './detalle-carrito-1.component.html',
  styleUrl: './detalle-carrito-1.component.scss',
  standalone: true
})
export class DetalleCarrito1Component implements OnInit {
    
    componente:ComponentesDTO = {
            id: 27,
            nombreComponente: 'lib-detalle-carrito-1',
            version: '1.0',
            descripcion: 'Componente para mostrar detalle de un producto'
          }
  
  @Input()
  product!: ProductoDTO;


  
  discount: number = 0;

  currentQuantity: number = 1;
  selectedImageUrl: string = '';
  showCartMessage: boolean = false;
  isFavorite: boolean = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
   this.checkIsProductExists();
  }

  checkIsProductExists(){
    if(this.product && this.product?.imagen.length > 0) {
      this.selectedImageUrl = this.product?.imagen[0].url
      this.discount = this.productService.calculateDiscount(this.product);
    }
  }
  updateMainImage(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
  }

  

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
  }

  isActiveThumbnail(imageUrl: string): boolean {
    return this.selectedImageUrl === imageUrl;
  }

 
}
