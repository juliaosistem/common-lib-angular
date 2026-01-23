import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit, Input,OnDestroy  } from '@angular/core';
import { GoogleService } from '../../../..//services/google.service';
import { BusinessDTO } from '@juliaosistem/core-dtos';
import { PrimegModule } from '../../../../modulos/primeg.module';

@Component({
  selector: 'lib-carruselt-1',
  templateUrl: './carruselt-1.html',
  styleUrls: ['./carruselt-1.scss'],
  imports: [CommonModule, PrimegModule, NgOptimizedImage],
})
export class Carruselt1 implements OnInit,OnDestroy {
  @Input() DatosNegocio: BusinessDTO | null = null;

  constructor(private googleService: GoogleService) {}

 slides = [{
      id: 1,
      tag: 'Fabricación de Inflables Publicitarios',
      tagClass: 'p-tag-info', // Azul para negocios
      // KEYWORD EXACTA: "Inflables Publicitarios"
      title: 'Inflables Publicitarios', 
      description: 'Potencia tu marca con nuestros inflables publicitarios, arcos de meta y carpas publicitarias. Fabricación a medida con logotipos de alta calidad.',
      image: 'assets/imagenes/inflablesPublicitarios.png', 
      // ALT OPTIMIZADO: Lo que buscan las empresas
      alt: 'Botella inflable publicitaria y arcos inflables',
      // Enlace directo a la categoría
      button: { text: 'Ver Catálogo Publicitario', link: '/inflables-publicitarios', class: 'p-button-info' }
    },
    {
      id: 2,
      tag: 'Fabrica de Toboganes Inflables',
      tagClass: 'p-tag-danger', // Rojo para acción/emoción
      // KEYWORD EXACTA: "Toboganes Inflables"
      title: 'Toboganes Inflables',
      description: 'Toboganes de alto impacto para parques y negocios de alquiler. Diseños extremos, seguros y con materiales de larga duración.',
      image: 'assets/imagenes/ToboganesInflables.png',
      // ALT OPTIMIZADO:
      alt: 'Venta de tobogán inflable',
      button: { text: 'Ver Toboganes', link: '/toboganes', class: 'p-button-danger' }
    },
    {
      id: 3,
      tag: 'Venta de Castillos Inflables',
      tagClass: 'p-tag-success', // Verde para diversión
      // KEYWORD EXACTA: "Castillos Inflables"
      title: 'Castillos y Saltarines',
      description: 'El clásico castillo inflable que no puede faltar. Variedad de temáticas, tamaños y colores. Ideales para iniciar tu negocio de alquiler.',
      image: 'assets/imagenes/castillosInflables.png',
      // ALT OPTIMIZADO:
      alt: 'Castillo inflable saltarín colorido para fiestas infantiles',
      button: { text: 'Cotizar Castillos', link: '/castillos', class: 'p-button-success' }
    }
  ];
  
   

  currentSlide = 0;
  private intervalId!: ReturnType<typeof setInterval>;

  /**
   * Método que se ejecuta al iniciar el componente
   * Inicia el carrusel automático
   */
  ngOnInit() {
    this.startAutoSlide();
  }

  /**
   * Método que se ejecuta al destruir el componente
   * Detiene el carrusel automático para evitar fugas de memoria
   */
  ngOnDestroy() {
    this.stopAutoSlide();
  }

  /**
   * Inicia la transición automática de las diapositivas
   * Cambia de slide cada 5 segundos
   */
  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  /**
   * Detiene la transición automática de las diapositivas
   * Limpia el intervalo si existe
   */
  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  /**
   * Avanza a la siguiente diapositiva
   * Utiliza el operador módulo para volver al inicio al llegar al final
   */
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  /**
   * Retrocede a la diapositiva anterior
   * Maneja el índice negativo para ir al último slide si se está en el primero
   */
  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  /**
   * Navega a una diapositiva específica por su índice
   * Reinicia el temporizador automático al cambiar manualmente
   * @param index Índice de la diapositiva a mostrar
   */
  goToSlide(index: number) {
    this.currentSlide = index;
    this.stopAutoSlide();
    this.startAutoSlide();
  }


  /**
   * Método para navegar a WhatsApp con un mensaje predefinido sobre el slide actual
   * @param slide Slide actual seleccionado
   * **/
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigateToWhatsapp(slide: any) {
    const currentUrl = window.location.href;
    const message = `Hola, estoy en tu página ${currentUrl} y me interesa  ${slide.title}`;
    const whatsappNumber = this.DatosNegocio?.telefono || '+573118025433';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    // Google Ads Conversion
    if (this.DatosNegocio?.googleAdsConversionId) {
      this.googleService.reportConversion(this.DatosNegocio.googleAdsConversionId, whatsappUrl);
    } else {
      window.open(whatsappUrl, '_blank');
    }
    // Google Analytics Event
    if (this.DatosNegocio?.googleAnalyticsEvent) {
      this.googleService.reportAnalyticsEvent(this.DatosNegocio.googleAnalyticsEvent, { slide: slide.title });
    }
  }
}
