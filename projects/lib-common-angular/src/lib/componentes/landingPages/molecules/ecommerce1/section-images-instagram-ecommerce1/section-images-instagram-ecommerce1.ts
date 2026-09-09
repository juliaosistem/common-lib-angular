import { Component, ElementRef, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ComponentesDTO } from '@juliaosistem/core-dtos';

@Component({
  selector: 'lib-section-images-instagram-ecommerce1',
  imports: [],
  templateUrl: './section-images-instagram-ecommerce1.html',
  styleUrl: './section-images-instagram-ecommerce1.scss',
  encapsulation: ViewEncapsulation.None
})
export class SectionImagesInstagramEcommerce1 implements OnInit, OnDestroy {

  // Metadata del componente    
        componente:ComponentesDTO = {
                id: 31,
                nombreComponente: 'lib-section-images-instagram-ecommerce1',
                version: '1.0',
                descripcion: 'Componente para mostrar imágenes de Instagram en la página de ecommerce1'
              }
  private observer?: IntersectionObserver;
  private cardsObserver?: IntersectionObserver;

  constructor(private el: ElementRef) {}

  /**
   * Inicializa los observers de la sección y de las tarjetas al montar el componente.
   */
  ngOnInit(): void {
    this.initSectionObserver();
    this.initCardsObserver();
  }

  /**
   * Inicializa el IntersectionObserver para la sección principal,
   * añadiendo o quitando la clase 'is-visible' según la visibilidad en viewport.
   */
  private initSectionObserver(): void {
    const options = { root: null, threshold: 0.2 };
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const section = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          section.classList.add('is-visible');
        } else {
          section.classList.remove('is-visible');
        }
      });
    }, options);

    const section = this.el.nativeElement.querySelector('.animate-instagram-section');
    if (section) {
      this.observer.observe(section);
    }
  }

  /**
   * Inicializa el IntersectionObserver para las tarjetas de Instagram,
   * aplicando animación escalonada al entrar en el viewport.
   */
  private initCardsObserver(): void {
    const cardOptions = { root: null, threshold: 0.1 };
    let index = 0;
    this.cardsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const card = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          card.style.transitionDelay = `${(index % 4) * 120}ms`;
          card.classList.add('is-visible');
        }
      });
      index += entries.length;
    }, cardOptions);

    const cards: NodeListOf<HTMLElement> = this.el.nativeElement.querySelectorAll('.social-card');
    cards.forEach((c) => this.cardsObserver?.observe(c));
  }

  /**
   * Limpia los observers al destruir el componente para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
    if (this.cardsObserver) {
      this.cardsObserver.disconnect();
      this.cardsObserver = undefined;
    }
  }
}
