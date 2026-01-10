import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PrimegModule } from 'lib-common-angular';

@Component({
  selector: 'lib-carruselt-1',
  templateUrl: './carruselt-1.html',
  styleUrls: ['./carruselt-1.scss'],
  imports: [CommonModule,PrimegModule],
})
export class Carruselt1 implements OnInit, OnDestroy {
  slides = [
    {
      tag: 'Fábrica',
      tagClass: 'p-tag-success',
      title: 'Fábrica de Inflables',
      description: 'Especialistas en inflables personalizados y recreativos para eventos, empresas y diversión.',
      image: 'assets/imagenes/bannerInflables.png',
      alt: 'Castillo inflable colorido para eventos',
      button: { text: 'Cotiza tu inflable', link: '/contacto', class: 'p-button-success' }
    },
    {
      tag: 'Tecnología',
      tagClass: 'p-tag-info',
      title: 'Futuro Digital',
      description: 'Implementamos las últimas tecnologías para optimizar procesos y conectar con el mundo a la velocidad de la luz.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
      alt: 'Tecnología de inflables',
      button: { text: 'Saber Más', link: '/tecnologia', class: 'p-button-info' }
    },
    {
      tag: 'Recreativos',
      tagClass: 'p-tag-warning',
      title: 'Diversión Segura',
      description: 'Juegos y productos recreativos certificados, ideales para tu negocio o evento. Seguridad y calidad garantizadas.',
      image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop',
      alt: 'Juegos recreativos',
      button: { text: 'Ver Productos', link: '/productos', class: 'p-button-warning' }
    }
  ];

  currentSlide = 0;
  private intervalId!: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.stopAutoSlide();
    this.startAutoSlide();
  }
}
