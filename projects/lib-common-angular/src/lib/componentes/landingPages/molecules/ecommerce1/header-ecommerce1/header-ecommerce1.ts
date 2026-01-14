/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { BusinessDTO, ComponentesDTO, MenuConfig, MenuItem } from '@juliaosistem/core-dtos';
import { TranslateService } from '@ngx-translate/core';
import { PrimegModule } from '../../../../../modulos/primeg.module';
import { IonicModule, MenuController } from '@ionic/angular';
import { HeaderTopEcommerce1 } from "../../../atoms/ecommerce1/header-top-ecommerce1/header-top-ecommerce1";

@Component({
  selector: 'lib-header-ecommerce1',
  imports: [CommonModule, RouterModule, FormsModule, PrimegModule, IonicModule, HeaderTopEcommerce1],
  templateUrl: './header-ecommerce1.html',
  styleUrls: ['./header-ecommerce1.scss'],
  encapsulation: ViewEncapsulation.None 
})
export class HeaderEcommerce1Component implements OnInit {

  // Metadata del componente  
  componente:ComponentesDTO = {
          id: 34,
          nombreComponente: 'lib-header-ecommerce1',
          version: '1.0',
          descripcion: 'Componente para mostrar el encabezado en la página de ecommerce1'
        }
  @Input() DatosNegocio :BusinessDTO | null = null;
    @Input() logoText: string = 'Zigma Inflables';
    @Input() logoUrl: string | null = null;
    @Input() logoAlt: string = 'Logo Zigma Inflables';
  
  // Configuración del menú
  @Input() menuConfig: MenuConfig | null = null;

  // Idioma
  seleccionada:string='es';

  @Input() islogin: boolean = false;
  
  // Configuración por defecto
  defaultMenuConfig: MenuConfig = {
    id: 'header-menu',
    name: 'Header Navigation',
    showIcons: true,
    items: [
      {
        id: 'home',
        label: 'Home',
        type: 'link',
        routerLink: ['/'],
        icon: 'pi-home',
        visible: true,
        order: 1,
        permissions: ["*"]
      },
      {
        id: 'about',
        label: 'About',
        type: 'link',
        routerLink: ['/about'],
        visible: true,
        order: 2,
        permissions: ["*"]
      },
      {
        id: 'categorias',
        label: 'Categorías',
        type: 'link',
        routerLink: ['/'],
        icon: 'pi pi-tags',
        visible: true,
        order: 3,
        permissions: ["*"]
      },
      {
        id: 'auth-separator',
        label: '',
        type: 'separator',
        separator: true,
        visible: true,
        order: 4
      },
      {
        id: 'login',
        label: 'Login',
        type: 'link',
        routerLink: ['/login'],
        icon: 'fas fa-sign-in-alt',
        visible: true,
        order: 5,
        permissions: ["*"]
      },
      {
        id: 'register',
        label: 'Register',
        type: 'link',
        routerLink: ['/register'],
        icon: '',
        visible: true,
        order: 6,
        permissions: ["*"]
      }
    ]
  };
 langs:string[];

 private touchStartX = 0;
  private touchEndX = 0;
  private touchStartY = 0;
  private lastTouchX = 0;
  private isSwiping = false;
  private readonly EDGE_ZONE = 40; // px desde el borde
  private readonly OPEN_THRESHOLD = 50; // distancia para abrir
  private readonly CLOSE_THRESHOLD = -80; // distancia para cerrar
  private readonly VERTICAL_TOLERANCE = 30; // tolerancia vertical para considerar swipe horizontal

  constructor(    private translate: TranslateService, private menuCtrl: MenuController, private router: Router) {
    this.translate.addLangs(["es","en"]);
    this.translate.use('es');
    this.langs = [...this.translate.getLangs()]
    
  }

  // Menú final que se usará en el template
  
  currentMenu: MenuConfig = this.defaultMenuConfig;
  isMobileMenuOpen: boolean = false;
  isCartOpen: boolean = false;
  cartItems: Array<{id:number; name:string; qty:number; price:number}> = [
    { id: 1, name: 'Inflable básico', qty: 1, price: 120 },
    { id: 2, name: 'Kit de reparación', qty: 2, price: 15 }
  ];

  ngOnInit(): void {
    /**
     * Inicializa el componente:
     * - Si `menuConfig` viene por input, lo utiliza como menú actual.
     * - Filtra y ordena los ítems del menú por el campo `order`.
     * - Habilita el menú de Ionic con id `headerMenu` para componentes anidados.
     */
    // Si se proporciona una configuración personalizada, usarla
    if (this.menuConfig) {
      this.currentMenu = this.menuConfig;
    }

    // Asegurar que el item 'Categorías' exista aunque llegue un menuConfig externo
    const hasCategorias = this.currentMenu.items.some(i => i.id?.toLowerCase() === 'categorias');
    if (!hasCategorias) {
      this.currentMenu.items.push({
        id: 'categorias',
        label: 'Categorías',
        type: 'link',
        routerLink: ['/'],
        icon: 'pi pi-tags',
        visible: true,
        order: 3,
        permissions: ["*"]
      });
    }
    
    // Ordenar items por order si existe
    this.currentMenu.items = this.currentMenu.items
      .filter(item => item.visible !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    // Asegurar que el menú esté habilitado por su id cuando se usa en componentes anidados
    this.menuCtrl.enable(true, 'headerMenu');
    console.log('Logo URL en Header:', this.logoUrl);
    if(this.DatosNegocio?.logo) this.logoUrl=this.DatosNegocio?.logo;
    
  }

  // --- LÓGICA DE SWIPE (DESLIZAR PARA ABRIR) ---

  // Detectar cuando el dedo toca la pantalla
  @HostListener('document:touchstart', ['$event'])
  /**
   * Maneja el evento `touchstart` del documento.
   * Guarda coordenadas iniciales y habilita el modo swipe si el toque inicia
   * cerca del borde izquierdo o si el menú ya está abierto.
   * @param e Evento táctil del documento.
   */
  onTouchStart(e: TouchEvent) {
    const t = e.changedTouches[0];
    this.touchStartX = t.clientX;
    this.touchStartY = t.clientY;
    this.lastTouchX = t.clientX;
    this.isSwiping = (!this.isMobileMenuOpen && this.touchStartX <= this.EDGE_ZONE) || this.isMobileMenuOpen;
  }

  // Detectar cuando el dedo se levanta
  /**
   * Maneja el evento `touchend` del documento.
   * Calcula desplazamiento total y decide abrir/cerrar mediante `handleSwipeGesture`.
   * @param e Evento táctil del documento.
   */
  @HostListener('document:touchend', ['$event'])
  onTouchEnd(e: TouchEvent) {
    const t = e.changedTouches[0];
    this.touchEndX = t.clientX;
    this.handleSwipeGesture();
    this.isSwiping = false;
  }

  // Seguimiento del movimiento para mejorar la detección de swipe
  /**
   * Maneja el evento `touchmove` del documento.
   * Detecta desplazamiento horizontal significativo con tolerancia vertical.
   * Abre/cierra el menú cuando supera los umbrales definidos.
   * @param e Evento táctil del documento.
   */
  @HostListener('document:touchmove', ['$event'])
  onTouchMove(e: TouchEvent) {
    if (!this.isSwiping) { return; }
    const t = e.changedTouches[0];
    const dx = t.clientX - this.lastTouchX;
    const dy = Math.abs(t.clientY - this.touchStartY);
    this.lastTouchX = t.clientX;
    if (Math.abs(dx) > 10 && dy <= this.VERTICAL_TOLERANCE) {
      const totalDx = t.clientX - this.touchStartX;
      if (!this.isMobileMenuOpen && this.touchStartX <= this.EDGE_ZONE && totalDx >= this.OPEN_THRESHOLD) {
        e.preventDefault();
        this.openMenu();
        this.isSwiping = false;
        return;
      }
      // Cierre en movimiento: menú abierto y supera umbral hacia la izquierda
      if (this.isMobileMenuOpen && totalDx <= this.CLOSE_THRESHOLD) {
        e.preventDefault();
        this.closeMenu();
        this.isSwiping = false;
        return;
      }
    }
  }

  /**
   * Evalúa el desplazamiento entre `touchstart` y `touchend` para decidir
   * apertura o cierre del menú móvil.
   */
  handleSwipeGesture() {
    // Apertura: inicio en borde y desplazamiento hacia derecha suficiente
    if (!this.isMobileMenuOpen && this.touchStartX <= this.EDGE_ZONE) {
      if (this.touchEndX - this.touchStartX >= this.OPEN_THRESHOLD) {
        this.openMenu();
        return;
      }
    }
    // Cierre: si menú abierto y hubo desplazamiento hacia izquierda suficiente
    if (this.isMobileMenuOpen) {
      if (this.touchEndX - this.touchStartX <= this.CLOSE_THRESHOLD) {
        this.closeMenu();
      }
    }
  }

  /**
   * Abre el `Drawer` del menú móvil y asegura el scroll al inicio del contenido.
   * También fuerza el scroll de la página al top para evitar solapamientos.
   */
  openMenu() {
    this.isMobileMenuOpen = true;
    // Al abrir el menú en móvil, asegurar que el contenido del Drawer esté scrolleado al inicio
    setTimeout(() => {
      const drawerContent = document.querySelector('.custom-sidebar .p-drawer-content') as HTMLElement;
      if (drawerContent) {
        drawerContent.scrollTop = 0;
      }
      // Asegurar que la página no afecte la visualización del menú
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 0);
  }
  closeMenu() {
    /** Cierra el menú móvil. */
    this.isMobileMenuOpen = false;
  }
  /** Abre el `Drawer` del carrito. */
  openCart() {
    this.isCartOpen = true;
  }
  closeCart() {
    /** Cierra el `Drawer` del carrito. */
    this.isCartOpen = false;
  }
  /**
   * Calcula el total del carrito sumando `price * qty`.
   * @returns Total acumulado.
   */
  getCartTotal(): number {
    return this.cartItems.reduce((acc, it) => acc + (it.price * it.qty), 0);
  }
  goToCheckout() {
    /** Acción placeholder para ir al checkout; cierra el carrito. */
    // Navegación simple: ajusta a tu ruta real de checkout
    console.log('Ir a checkout');
    this.isCartOpen = false;
  }
  

 toggleMobileMenu() {
    /** Toggle simple del menú móvil (abre/cierra). */
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  
  
  
  cambiaLang(event: any) {
    /**
     * Cambia el idioma activo usando `TranslateService`.
     * @param event Idioma seleccionado (código ISO).
     */
   
    this.translate.use(event)
     
   }
   /**
    * Configura idiomas disponibles y selecciona automáticamente
    * según el lenguaje del navegador (`en`|`es`).
    */
  configLangs() {
    this.translate.addLangs(['en', 'es']);
  
    if (this.translate.getBrowserLang() == 'en') {
       this.translate.use('en');
     } else if (this.translate.getBrowserLang() == 'es') {
       this.translate.use('es');
     } else {
       this.translate.use('en');
          }
      }

  // Método para obtener items del menú izquierdo (primeros elementos)
  /**
   * Retorna ítems visibles no relacionados con autenticación
   * para mostrarlos en la zona izquierda del menú principal.
   * @returns Array de `MenuItem` para el menú izquierdo.
   */
  getLeftMenuItems(): MenuItem[] {
    // Mostrar todos los items de navegación excepto los de auth en la izquierda
    return this.currentMenu.items.filter(item => 
      !item.separator && 
      !['login', 'register'].includes(item.id)
    );
  }

  // Método para obtener items del menú derecho (últimos elementos)
  /** Retorna los ítems de autenticación (login/register) para la zona derecha. */
  getRightMenuItems(): MenuItem[] {
    return this.currentMenu.items.filter(item => 
      !item.separator && 
      ['login', 'register'].includes(item.id)
    );
  }

  // Método para obtener todos los items visibles para móvil
  /** Retorna todos los ítems visibles para el menú móvil. */
  getMobileMenuItems(): MenuItem[] {
    return this.currentMenu.items
  }

  // Método para manejar clics en el menú
  /**
   * Maneja clics en ítems del menú:
   * - Previene navegación si el ítem está deshabilitado.
   * - Para `nosotros` y `categorias`, desplaza a la sección correspondiente
   *   o navega con fragment si no se está en Home.
   * - Cierra el menú móvil tras la acción.
   */
 onMenuItemClick(item: MenuItem, event?: Event): void {
    if (item.disabled) {
      event?.preventDefault();
      return;
    }

    const id = item.id?.toLowerCase();
    if (id === 'nosotros') {
      event?.preventDefault();
      this.handleSectionClick('nosotros');
      return;
    }

    if (id === 'categorias') {
      event?.preventDefault();
      this.handleSectionClick('categorias');
      return;
    }

    this.isMobileMenuOpen = false; // Cerrar menú al hacer click
    console.log('Menu item clicked:', item);
  }

  /** Determina si la ruta actual corresponde al Home. */
  private isHomeRoute(): boolean {
    return this.router.url === '/' || this.router.url.startsWith('/home');
  }

  /**
   * Gestiona la navegación/scroll hacia una sección identificada por `anchorId`.
   * Si se está en Home y la sección existe, hace `scrollIntoView` suave.
   * En caso contrario, navega a Home con `fragment`.
   */
  private handleSectionClick(anchorId: 'nosotros' | 'categorias'): void {
    const isHome = this.isHomeRoute();
    if (isHome) {
      const target = document.getElementById(anchorId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        this.router.navigate(['/'], { fragment: anchorId });
      }
    } else {
      this.router.navigate(['/'], { fragment: anchorId });
    }
    this.isMobileMenuOpen = false;
  }

  
}
