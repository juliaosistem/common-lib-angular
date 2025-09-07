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
  // Metadata del componente    
    componente:ComponentesDTO = {
            id: 27,
            nombreComponente: 'lib-detalle-carrito-1',
            version: '1.0',
            descripcion: 'Componente para mostrar detalle de un producto'
          }
  
  @Input()
  // Variable que recibe el producto a mostrar
  product!: ProductoDTO;

  // Variable que determina si el usuario está logueado
  @Input()
  isLogin: boolean = false;

  // Variable que determina el descuento aplicado al producto
  discount: number = 0;

  // Variable que determina la cantidad actual del producto
  currentQuantity: number = 1;
  // Variable que almacena la URL de la imagen seleccionada
  selectedImageUrl: string = '';
  // Variable que controla la visibilidad del mensaje de agregado al carrito
  showCartMessage: boolean = false;
  // Variable que indica si el producto es favorito
  isFavorite: boolean = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
   this.checkIsProductExists();
  }

/**
 * Método para verificar si el producto existe y tiene imágenes
 * Si el producto tiene imágenes, se selecciona la primera imagen por defecto
 * y se calcula el descuento utilizando el servicio de productos.
 */
  checkIsProductExists(){
    if(this.product && this.product?.imagen.length > 0) {
      this.selectedImageUrl = this.product?.imagen[0].url
      this.discount = this.productService.calculateDiscount(this.product);
    }
  }

  /**
   * 
   * @param imageUrl URL de la imagen seleccionada
   * Método para actualizar la imagen principal cuando se selecciona una miniatura
   */
  updateMainImage(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
  }

  


  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
  }


/**
 * 
 * @param imageUrl URL de la imagen a verificar
 * Método para verificar si una miniatura es la imagen activa
 * @returns 
 */
  isActiveThumbnail(imageUrl: string): boolean {
    return this.selectedImageUrl === imageUrl;
  }

 
}
