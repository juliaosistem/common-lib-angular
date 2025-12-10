/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ComponentesDTO, MenuConfig, MenuItem } from '@juliaosistem/core-dtos';
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
  
  @Input() logoText: string = 'Zigma Inflables';
  
  // Configuración del menú
  @Input() menuConfig: MenuConfig | null = null;

  // Idioma
  seleccionada:string='es';
  
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
        routerLink: ['/pages/ecommerce1'],
        icon: 'pi-home',
        visible: true,
        order: 1,
        permissions: ["*"]
      },
      {
        id: 'about',
        label: 'About',
        type: 'link',
        routerLink: ['/pages/ecommerce1/about'],
        visible: true,
        order: 2,
        permissions: ["*"]
      },
      {
        id: 'auth-separator',
        label: '',
        type: 'separator',
        separator: true,
        visible: true,
        order: 3
      },
      {
        id: 'login',
        label: 'Login',
        type: 'link',
        routerLink: ['/pages/ecommerce1/login'],
        icon: 'fas fa-sign-in-alt',
        visible: true,
        order: 4,
        permissions: ["*"]
      },
      {
        id: 'register',
        label: 'Register',
        type: 'link',
        routerLink: ['/pages/ecommerce1/register'],
        icon: '',
        visible: true,
        order: 5,
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

  constructor(    private translate: TranslateService, private menuCtrl: MenuController) {
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
    // Si se proporciona una configuración personalizada, usarla
    if (this.menuConfig) {
      this.currentMenu = this.menuConfig;
    }
    
    // Ordenar items por order si existe
    this.currentMenu.items = this.currentMenu.items
      .filter(item => item.visible !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    // Asegurar que el menú esté habilitado por su id cuando se usa en componentes anidados
    this.menuCtrl.enable(true, 'headerMenu');
  }

  // --- LÓGICA DE SWIPE (DESLIZAR PARA ABRIR) ---

  // Detectar cuando el dedo toca la pantalla
  @HostListener('document:touchstart', ['$event'])
  onTouchStart(e: TouchEvent) {
    const t = e.changedTouches[0];
    this.touchStartX = t.clientX;
    this.touchStartY = t.clientY;
    this.lastTouchX = t.clientX;
    // Iniciar swipe solo si comienza en el borde izquierdo y el menú está cerrado
    this.isSwiping = (!this.isMobileMenuOpen && this.touchStartX <= this.EDGE_ZONE) || this.isMobileMenuOpen;
  }

  // Detectar cuando el dedo se levanta
  @HostListener('document:touchend', ['$event'])
  onTouchEnd(e: TouchEvent) {
    const t = e.changedTouches[0];
    this.touchEndX = t.clientX;
    this.handleSwipeGesture();
    this.isSwiping = false;
  }

  // Seguimiento del movimiento para mejorar la detección de swipe
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

  openMenu() {
    this.isMobileMenuOpen = true;
  }
  closeMenu() {
    this.isMobileMenuOpen = false;
  }
  openCart() {
    this.isCartOpen = true;
  }
  closeCart() {
    this.isCartOpen = false;
  }
  getCartTotal(): number {
    return this.cartItems.reduce((acc, it) => acc + (it.price * it.qty), 0);
  }
  goToCheckout() {
    // Navegación simple: ajusta a tu ruta real de checkout
    console.log('Ir a checkout');
    this.isCartOpen = false;
  }
  

 toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  
  
  
  cambiaLang(event: any) {
   
    this.translate.use(event)
     
   }
  configLangs() {
    // Add languages
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
  getLeftMenuItems(): MenuItem[] {
    return this.currentMenu.items.filter(item => 
      !item.separator && 
      ['home', 'about'].includes(item.id)
    );
  }

  // Método para obtener items del menú derecho (últimos elementos)
  getRightMenuItems(): MenuItem[] {
    return this.currentMenu.items.filter(item => 
      !item.separator && 
      ['login', 'register'].includes(item.id)
    );
  }

  // Método para obtener todos los items visibles para móvil
  getMobileMenuItems(): MenuItem[] {
    return this.currentMenu.items
  }

  // Método para manejar clics en el menú
 onMenuItemClick(item: MenuItem, event?: Event): void {
    if (item.disabled) {
      event?.preventDefault();
      return;
    }
    this.isMobileMenuOpen = false; // Cerrar menú al hacer click
    console.log('Menu item clicked:', item);
  }

  
}
