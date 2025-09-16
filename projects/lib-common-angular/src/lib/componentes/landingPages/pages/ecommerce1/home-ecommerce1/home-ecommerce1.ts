import { Component, Input } from '@angular/core';
import { HeroSectionEcommerce1 } from "../../../molecules/ecommerce1/hero-section-ecommerce1/hero-section-ecommerce1";
import { SectionFiltersCategoriesProductos } from "../../../../shared/molecules/section-filters-categories-productos/section-filters-categories-productos";
import { CategoriaDTO, ComponentesDTO, ProductoDTO } from '@juliaosistem/core-dtos';
import { CardProductos1Component } from "../../../../../../public-api";
import { SectionImagesInstagramEcommerce1 } from '../../../molecules/ecommerce1/section-images-instagram-ecommerce1/section-images-instagram-ecommerce1';

@Component({
  selector: 'lib-home-ecommerce1',
  imports: [
    HeroSectionEcommerce1, SectionFiltersCategoriesProductos, 
   CardProductos1Component, SectionImagesInstagramEcommerce1
          ],
  templateUrl: './home-ecommerce1.html',
  styleUrl: './home-ecommerce1.scss'
})
export class HomeEcommerce1 {

  // Metadata del componente    
  componente: ComponentesDTO = {
    id: 28,
    nombreComponente: 'lib-home-ecommerce1',
    version: '1.0',
    descripcion: 'Componente para mostrar home de ecommerce1'
  }

  // El usuario inicio sesion o no
  @Input() isLogin: boolean = false;

  // Productos a mostrar
  @Input() Products !: ProductoDTO [];
  // Categorias a mostrar
  @Input() Categorias!: CategoriaDTO [];

}
