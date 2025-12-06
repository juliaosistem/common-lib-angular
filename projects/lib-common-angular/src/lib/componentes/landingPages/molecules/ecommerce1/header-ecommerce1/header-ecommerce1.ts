import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComponentesDTO, MenuConfig, MenuItem } from '@juliaosistem/core-dtos';

@Component({
  selector: 'lib-header-ecommerce1',
  imports: [CommonModule,RouterModule],
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
  @Input() menuConfig: MenuConfig | null = null;
  
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
        icon: 'fas fa-home',
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
        icon: 'fas fa-user-plus',
        visible: true,
        order: 5,
        permissions: ["*"]
      }
    ]
  };

  // Menú final que se usará en el template
  
  currentMenu: MenuConfig = this.defaultMenuConfig;

  ngOnInit(): void {
    // Si se proporciona una configuración personalizada, usarla
    if (this.menuConfig) {
      this.currentMenu = this.menuConfig;
    }
    
    // Ordenar items por order si existe
    this.currentMenu.items = this.currentMenu.items
      .filter(item => item.visible !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
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
    return this.currentMenu.items.filter(item => !item.separator);
  }

  // Método para manejar clics en el menú
  onMenuItemClick(item: MenuItem, event?: Event): void {
    if (item.disabled) {
      event?.preventDefault();
      return;
    }
    
    // Aquí puedes emitir eventos o manejar lógica adicional
    console.log('Menu item clicked:', item);
  }
}
