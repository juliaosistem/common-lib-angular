import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { HeroSectionEcommerce1 } from "../../../molecules/ecommerce1/hero-section-ecommerce1/hero-section-ecommerce1";
import { SectionFiltersCategoriesProductos } from "../../../../shared/molecules/section-filters-categories-productos/section-filters-categories-productos";
import { CardProductos1Component } from "../../../../shared/molecules/productos/card-productos1/card-productos1.component";
import { SectionImagesInstagramEcommerce1 } from '../../../molecules/ecommerce1/section-images-instagram-ecommerce1/section-images-instagram-ecommerce1';
import { PaginatorPgComponent } from '../../../../shared/atoms/paginator-pg/paginator-pg.component';
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
    SectionImagesInstagramEcommerce1,
    PaginatorPgComponent
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

  constructor(private el: ElementRef) {}

  ngOnInit(): void {}
  ngAfterViewInit() {
    this.iniciarAnimacionScroll();
  }

  /**
   * Inicializa la animación de scroll configurando los observadores necesarios.
   */
  iniciarAnimacionScroll(): void {
    const observer = this.createIntersectionObserver();
    this.initialObservation(observer);
    this.setupMutationObserver(observer);
  }

  /**
   * Crea el IntersectionObserver para manejar la visibilidad de los elementos.
   * @returns Instancia de IntersectionObserver configurada.
   */
  private createIntersectionObserver(): IntersectionObserver {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    return new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);
  }

  /**
   * Selecciona los elementos a animar y los añade al observador.
   * @param observer El IntersectionObserver activo.
   */
  private observeElements(observer: IntersectionObserver): void {
    const tarjetas = this.el.nativeElement.querySelectorAll('.product-card-animation');
    tarjetas.forEach((tarjeta: Element) => observer.observe(tarjeta));
    const newsletter = this.el.nativeElement.querySelectorAll('.animate-newsletter-section');
    newsletter.forEach((sec: Element) => observer.observe(sec));
  }

  /**
   * Realiza la observación inicial después de un breve retraso para asegurar el renderizado.
   * @param observer El IntersectionObserver activo.
   */
  private initialObservation(observer: IntersectionObserver): void {
    setTimeout(() => {
      this.observeElements(observer);
    }, 50);
  }

  /**
   * Configura un MutationObserver para detectar cambios en la paginación y re-observar elementos.
   * @param observer El IntersectionObserver activo.
   */
  private setupMutationObserver(observer: IntersectionObserver): void {
    const mutationObserver = new MutationObserver((mutations) => {
      const shouldUpdate = mutations.some(mutation => mutation.addedNodes.length > 0);
      if (shouldUpdate) {
        this.observeElements(observer);
      }
    });

    const paginatorElement = this.el.nativeElement.querySelector('lib-paginator-pg');
    if (paginatorElement) {
      mutationObserver.observe(paginatorElement, { childList: true, subtree: true });
    }
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
