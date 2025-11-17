import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HeroSectionEcommerce1 } from "../../../molecules/ecommerce1/hero-section-ecommerce1/hero-section-ecommerce1";
import { SectionFiltersCategoriesProductos } from "../../../../shared/molecules/section-filters-categories-productos/section-filters-categories-productos";
import { CardProductos1Component } from "../../../../../../public-api";
import { SectionImagesInstagramEcommerce1 } from '../../../molecules/ecommerce1/section-images-instagram-ecommerce1/section-images-instagram-ecommerce1';
import { CategoriaDTO, ComponentesDTO, ProductoDTO } from '@juliaosistem/core-dtos';

@Component({
  selector: 'lib-home-ecommerce1',
  imports: [
    HeroSectionEcommerce1,
    SectionFiltersCategoriesProductos,
    CardProductos1Component,
    SectionImagesInstagramEcommerce1
  ],
  templateUrl: './home-ecommerce1.html',
  styleUrls: ['./home-ecommerce1.scss']
})
export class HomeEcommerce1 implements OnInit {

  // Metadata del componente    
  componente: ComponentesDTO = {
    id: 28,
    nombreComponente: 'lib-home-ecommerce1',
    version: '1.0',
    descripcion: 'Componente para mostrar home de ecommerce1'
  }

  // ===== Inputs desde la app =====
  @Input() isLogin: boolean = false;
  @Input() Products: ProductoDTO[] = [];
  @Input() Categorias: CategoriaDTO[] = [];

  // ===== Outputs para eventos hacia la app =====
  @Output() productClicked = new EventEmitter<ProductoDTO>();
  @Output() categorySelected = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  // ===== Métodos para interactuar con la app =====
  onProductClick(product: ProductoDTO): void {
    this.productClicked.emit(product);
  }

  onCategoryFilter(category: string): void {
    this.categorySelected.emit(category);
  }
}
