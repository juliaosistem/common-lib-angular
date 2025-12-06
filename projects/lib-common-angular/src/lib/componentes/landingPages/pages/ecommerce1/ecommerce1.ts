import { Component, OnDestroy, OnInit, ElementRef, ViewChild, Renderer2, PLATFORM_ID, Inject, Input, OnChanges } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderEcommerce1Component } from "../../molecules/ecommerce1/header-ecommerce1/header-ecommerce1";
import { BarFloatEcommerce1 } from "../../molecules/ecommerce1/bar-float-ecommerce1/bar-float-ecommerce1";
import { FooterEcommerce1 } from "../../molecules/ecommerce1/footer-ecommerce1/footer-ecommerce1";
import { RouterOutlet } from '@angular/router';
import { ProductoDTO ,CategoriaDTO, MenuConfig, MenuItem} from '@juliaosistem/core-dtos';
@Component({
  selector: 'lib-ecommerce1',
  imports: [CommonModule, DialogModule, ButtonModule, BarFloatEcommerce1, FooterEcommerce1, HeaderEcommerce1Component, RouterOutlet],
  templateUrl: './ecommerce1.html',
  styleUrl: './ecommerce1.scss',
})
export class Ecommerce1 implements OnInit, OnDestroy, OnChanges {

  // El usuario inicio sesion o no
  @Input() isLogin: boolean = false;

  // Productos a mostrar
  @Input() Products !: ProductoDTO [];
  // Categorias a mostrar
  @Input() Categorias!: CategoriaDTO [];

  // Rutas para navegación 
  @Input() routePaths: { [key: string]: string } = {
    home: './',
    login: 'login',
    register: 'register'
  };

  // Configuración del menú 
    headerMenuConfig: MenuConfig | null = null;

  @ViewChild('whatsappButton', { static: false }) whatsappButton!: ElementRef;
  @ViewChild('productGrid', { static: false }) productGrid!: ElementRef;
  @ViewChild('mobileMenu', { static: false }) mobileMenu!: ElementRef;

  // Estado del componente
  currentPage: string ='';
  showWhatsappButton = false;
  showWhatsappModal = false;
  whatsappModalShown = false;
  isMobileMenuOpen = false;

  // Timers y listeners
  private whatsappModalTimer?: number;
  private scrollListener?: () => void;
  private mouseOutListener?: (event: MouseEvent) => void;
  private intersectionObserver?: IntersectionObserver;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeAnimations();
      this.setupWhatsappModal();
      this.setupScrollListener();
    }
     this.updateMenuConfig();
  }

  ngOnChanges(): void {
    // Los datos han cambiado, aquí puedes actualizar cualquier lógica necesaria
    console.log('Datos actualizados:', {
      productos: this.Products?.length || 0,
      categorias: this.Categorias?.length || 0,
      isLogin: this.isLogin
    });
  }

  ngAfterViewInit(): void {
    this.handleWhatsappButtonVisibility();
  }
  ngOnDestroy(): void {
    this.cleanup();
  }

   getItemsInHeaderMenu(): MenuItem[]  {
    return  [
        { id: 'home',label: 'Home',
          type: 'link',
          routerLink: [this.routePaths['home'] || './'],
          icon: 'fas fa-home',visible: true, order: 1
        },
        {
          id: 'login',
          label: 'Login',
          type: 'link',
          routerLink: [this.routePaths['login'] || 'login'],
          icon: 'fas fa-sign-in-alt', visible: true,  order: 4
        },   {
          id: 'register',
          label: 'Register',
          type: 'link',
          routerLink: [this.routePaths['register'] || 'register'],
          icon: 'fas fa-user-plus',visible: true,  order: 5
        }
      ]
  }
  
  private updateMenuConfig(): void {
    this.headerMenuConfig = {
      name: 'Header Menu',
      id: 'header-menu',
      items: this.getItemsInHeaderMenu()
    };
  }
      
        // ===== NAVEGACIÓN =====
  navigateToPage(page: string): void {
    this.currentPage = page;
    this.isMobileMenuOpen = false;
    
    // Usar Angular Router para navegación
    const path = this.routePaths[page];
    if (path !== undefined) {
      this.router.navigate([path], { relativeTo: this.route });
    }
  }

  // ===== MENÚ MÓVIL =====
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // ===== WHATSAPP FUNCIONALIDAD =====
  setupWhatsappModal(): void {
    // Mostrar modal después de 10 segundos
    this.whatsappModalTimer = window.setTimeout(() => {
      this.showWhatsappModalDialog();
    }, 10000);

    // Exit intent detection
    this.mouseOutListener = (event: MouseEvent) => {
      if (event.clientY <= 0 && !this.whatsappModalShown) {
        this.showWhatsappModalDialog();
      }
    };
    document.addEventListener('mouseout', this.mouseOutListener);
  }

  showWhatsappModalDialog(): void {
    if (this.currentPage === 'home' && !this.whatsappModalShown) {
      this.showWhatsappModal = true;
      this.whatsappModalShown = true;
    }
  }

  hideWhatsappModal(): void {
    this.showWhatsappModal = false;
  }

  openWhatsappChat(message?: string): void {
    const defaultMessage = 'Hola, estoy interesado en los productos de Zigma Inflables.';
    const whatsappNumber = '1234567890'; // Reemplazar con número real
    const finalMessage = message || defaultMessage;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(finalMessage)}`;
    window.open(whatsappUrl, '_blank');
  }

  // ===== NEWSLETTER =====
  onNewsletterSubmit(email: string): void {
    const message = `Hola, quiero ver tus productos. Este es mi correo: ${email}. Vi esto desde tu página web.`;
    this.openWhatsappChat(message);
  }

  // ===== SCROLL ANIMATIONS =====
  setupScrollListener(): void {
    this.scrollListener = () => {
      this.handleWhatsappButtonVisibility();
    };
    window.addEventListener('scroll', this.scrollListener);
  }

  private handleWhatsappButtonVisibility(): void {
    if (this.currentPage !== 'home') {
      this.showWhatsappButton = false;
      return;
    }

    if (this.productGrid?.nativeElement) {
      const productGridTop = this.productGrid.nativeElement.offsetTop;
      if (window.scrollY > (productGridTop - 500)) {
        this.showWhatsappButton = true;
      } else {
        this.showWhatsappButton = false;
      }
    }
  }

  // ===== ANIMACIONES =====
  initializeAnimations(): void {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.addClass(entry.target, 'is-visible');
          this.intersectionObserver?.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observar elementos cuando el DOM esté listo
    setTimeout(() => {
      this.observeAnimationElements();
      this.animateTitle();
    }, 100);
  }

  // eslint-disable-next-line max-lines-per-function
  private observeAnimationElements(): void {
    if (!this.intersectionObserver) return;

    // Elementos generales con animación de scroll
    const animateElements = document.querySelectorAll('.animate-scroll');
    animateElements.forEach(element => {
      this.intersectionObserver?.observe(element);
    });

    // Tarjetas de producto con animación escalonada
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
      this.renderer.setStyle(card, 'transition-delay', `${index * 0.2}s`);
      this.intersectionObserver?.observe(card);
    });

    // Otros elementos animados
    const categoryCards = document.querySelectorAll('.category-card-animation');
    categoryCards.forEach(card => {
      this.intersectionObserver?.observe(card);
    });

    const heroSection = document.querySelector('.animate-hero-section');
    if (heroSection) {
      this.intersectionObserver.observe(heroSection);
    }

    const historySection = document.querySelector('.animate-history-section');
    if (historySection) {
      this.intersectionObserver.observe(historySection);
    }

    const instagramSection = document.querySelector('.animate-instagram-section');
    if (instagramSection) {
      this.intersectionObserver.observe(instagramSection);
    }

    const newsletterSection = document.querySelector('.animate-newsletter-section');
    if (newsletterSection) {
      this.intersectionObserver.observe(newsletterSection);
    }
  }

  private animateTitle(): void {
    const toystoreTitle = document.getElementById('toystore-title');
    if (toystoreTitle) {
      this.renderer.addClass(toystoreTitle, 'logo-rotate');
    }
  }

  // ===== PRODUCTOS =====
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onProductClick(product: any): void {
    console.log('Product clicked:', product);
    // Implementar navegación a detalle del producto
    // this.router.navigate(['/ecommerce1/product', product.id]);
  }

  onCategoryFilter(category: string): void {
    console.log('Filter by category:', category);
    // Implementar filtrado de productos
  }

  // ===== CLEANUP =====
  private cleanup(): void {
    if (this.whatsappModalTimer) {
      clearTimeout(this.whatsappModalTimer);
    }
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
    if (this.mouseOutListener) {
      document.removeEventListener('mouseout', this.mouseOutListener);
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  // ===== EVENTOS DEL TEMPLATE =====
  // Nota: con PrimeNG `p-dialog` manejamos el hide mediante `(onHide)`

  onLanguageChange(language: string): void {
    console.log('Language changed to:', language);
    // Implementar cambio de idioma
  }

  onSocialLogin(provider: 'google' | 'facebook'): void {
    console.log('Social login with:', provider);
    // Implementar login social
  }
}
