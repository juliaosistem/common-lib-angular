import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { HeroSectionEcommerce1 } from "../../../molecules/ecommerce1/hero-section-ecommerce1/hero-section-ecommerce1";
import { SectionFiltersCategoriesProductos } from "../../../../shared/molecules/section-filters-categories-productos/section-filters-categories-productos";
import { CardProductos1Component } from "../../../../shared/molecules/productos/card-productos1/card-productos1.component";
import { SectionImagesInstagramEcommerce1 } from '../../../molecules/ecommerce1/section-images-instagram-ecommerce1/section-images-instagram-ecommerce1';
import { CategoriaDTO, ComponentesDTO, ProductoDTO } from '@juliaosistem/core-dtos';

@Component({
  selector: 'lib-home-ecommerce1',
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    HeroSectionEcommerce1,
    SectionFiltersCategoriesProductos,
    CardProductos1Component,
    SectionImagesInstagramEcommerce1
  ],
  templateUrl: './home-ecommerce1.html',
  styleUrls: ['./home-ecommerce1.scss']
})
export class HomeEcommerce1 implements OnInit , AfterViewInit {

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
  ngAfterViewInit() {
    this.iniciarAnimacionScroll();
  }

  iniciarAnimacionScroll() {
    // Configuramos el observador: se activa cuando el 10% del elemento es visible
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Si el elemento entra en pantalla...
        if (entry.isIntersecting) {
          // ...le agregamos la clase que lo hace visible
          entry.target.classList.add('is-visible');
          // Y dejamos de observarlo para ahorrar memoria
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Seleccionamos todas las tarjetas y las empezamos a observar
    // Usamos setTimeout para asegurar que el @for ya terminó de renderizar
    setTimeout(() => {
      const tarjetas = document.querySelectorAll('.product-card-animation');
      tarjetas.forEach((tarjeta) => observer.observe(tarjeta));
      const newsletter = document.querySelectorAll('.animate-newsletter-section');
      newsletter.forEach((sec) => observer.observe(sec));
    }, 100);
  }

  // ===== Métodos para interactuar con la app =====
  onProductClick(product: ProductoDTO): void {
    this.productClicked.emit(product);
  }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
onAddToCart(event: any) {
  console.log("Evento recibido:", event);
}
  onCategoryFilter(category: string): void {
    this.categorySelected.emit(category);
  }
}
