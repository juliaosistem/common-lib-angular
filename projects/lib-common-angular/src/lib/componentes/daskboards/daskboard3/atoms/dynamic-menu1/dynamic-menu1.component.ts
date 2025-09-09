import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem1Component } from '../../../../shared/atoms/menu-item1/menu-item1.component';
import {MenuManager } from '../../../../shared/interfaces/menu.interface';
import { DynamicMenuService } from '../../../../shared/services/dynamic-menu.service';
import { MenuConfig, MenuItem,MenuEvent } from '@juliaosistem/core-dtos';

@Component({
  selector: 'app-dynamic-menu1',
  standalone: true,
  imports: [CommonModule, MenuItem1Component],
  templateUrl: './dynamic-menu1.component.html',
  styleUrls: ['./dynamic-menu1.component.scss']
})
export class DynamicMenu1Component implements OnInit {
  @Input() menuId!: string;
  @Input() userPermissions: string[] = [];
  @Input() menuConfig?: MenuConfig;
  @Input() autoLoad: boolean = true;

  @Output() menuEvent = new EventEmitter<MenuEvent>();
  @Output() menuLoaded = new EventEmitter<MenuConfig>();
  @Output() menuError = new EventEmitter<string>();

  config?: MenuConfig;
  menuItems: MenuItem[] = [];
 collapsed = false;
  loading = false;
  error?: string;
  activeItemId?: string;
  expandedItems: Set<string> = new Set(); // Rastrear elementos expandidos

  private menuManager?: MenuManager;
  private subscription?: unknown;

  constructor(private menuService: DynamicMenuService) {}

  ngOnInit() {
    if (this.menuConfig) {
      this.setConfig(this.menuConfig);
    } else if (this.autoLoad && this.menuId) {
      this.loadMenu();
    }
  }


  async loadMenu() {
    if (!this.menuId) {
      this.error = 'ID de menú no proporcionado';
      this.menuError.emit(this.error);
      return;
    }

    this.loading = true;
    this.error = undefined;

    try {
      this.config = await this.menuService.getMenuConfig(this.menuId);
      this.setConfig(this.config);
      this.menuLoaded.emit(this.config);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Error al cargar el menú';
      this.menuError.emit(this.error);
    } finally {
      this.loading = false;
    }
  }

  private setConfig(config: MenuConfig) {
    this.config = config;
    this.collapsed = config.collapsed ?? false;
    this.menuManager = new MenuManager(config);
    this.updateMenuItems();
  }

  private updateMenuItems() {
    if (!this.menuManager) return;

    let items = this.menuManager.getOrderedItems();

    // Filtrar por permisos si se proporcionan
    if (this.userPermissions.length > 0) {
      items = this.menuManager.filterByPermissions(this.userPermissions);
    }

    this.menuItems = items;
  }

  getMenuClasses(): string {
    const classes = ['dynamic-menu'];
    
    if (this.config?.orientation === 'horizontal') {
      classes.push('menu-horizontal');
    }
    
    if (this.config?.theme === 'dark') {
      classes.push('theme-dark');
    }
    
    return classes.join(' ');
  }

  toggleMenu() {
    if (this.config?.collapsible) {
      this.collapsed = !this.collapsed;
      console.log('Menu Event toggleMenu:',this.collapsed);
      this.menuEvent.emit({
        type: this.collapsed ? 'collapse' : 'expand',
        item: { id: 'menu-toggle', label: 'Menu Toggle', type: 'item' }
      });
    }
  }

  onMenuItemEvent(event: MenuEvent) {
    // Manejar eventos específicos del menú
    console.log('Menu Event: onMenuItemEvent', event);
    
    switch (event.type) {
      case 'click':
        this.activeItemId = event.item.id;
        
        // Si el item tiene submenús, toggle su estado expandido
        if (this.hasSubItems(event.item)) {
          this.toggleItemExpansion(event.item.id);
        }
        break;
      case 'expand':
        this.expandedItems.add(event.item.id);
        break;
      case 'collapse':
        this.expandedItems.delete(event.item.id);
        break;
    }

    // Propagar evento hacia arriba
    this.menuEvent.emit(event);
  }

  // Verificar si un item tiene submenús
  private hasSubItems(item: MenuItem): boolean {
    return !!(item.items && item.items.length > 0);
  }

  // Toggle expansión de un item
  private toggleItemExpansion(itemId: string) {
    if (this.expandedItems.has(itemId)) {
      this.expandedItems.delete(itemId);
      this.menuEvent.emit({
        type: 'collapse',
        item: { id: itemId, label: '', type: 'item' }
      });
    } else {
      this.expandedItems.add(itemId);
      this.menuEvent.emit({
        type: 'expand',
        item: { id: itemId, label: '', type: 'item' }
      });
    }
  }

  // Método para verificar si un item está expandido (usar en template)
  isItemExpanded(itemId: string): boolean {
    return this.expandedItems.has(itemId);
  }

  // Métodos públicos para manipular el menú
  async addMenuItem(item: MenuItem) {
    if (!this.menuId) return;
    
    try {
      await this.menuService.addMenuItem(this.menuId, item);
      await this.loadMenu(); // Recargar menú
    } catch (err) {
      this.error = 'Error al agregar elemento del menú';
      this.menuError.emit(this.error + err);
    }
  }

  async removeMenuItem(itemId: string) {
    if (!this.menuId) return;
    
    try {
      await this.menuService.removeMenuItem(this.menuId, itemId);
      await this.loadMenu(); // Recargar menú
    } catch (err) {
      this.error = 'Error al eliminar elemento del menú';
      this.menuError.emit(this.error + err);
    }
  }

  async updateMenuItem(itemId: string, updates: Partial<MenuItem>) {
    if (!this.menuId) return;
    
    try {
      await this.menuService.updateMenuItem(this.menuId, itemId, updates);
      await this.loadMenu(); // Recargar menú
    } catch (err) {
      this.error = 'Error al actualizar elemento del menú';
      this.menuError.emit(this.error + err);
    }
  }

  setActiveItem(itemId: string) {
    this.activeItemId = itemId;
  }

  refreshMenu() {
    this.loadMenu();
  }
} 