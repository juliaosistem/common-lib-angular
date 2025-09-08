import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuConfig, MenuItem, MenuEvent } from '@juliaosistem/core-dtos';
import { DynamicMenuService } from '../../../../shared/services/dynamic-menu.service';
import { DynamicMenu1Component } from '../../atoms/dynamic-menu1/dynamic-menu1.component';

@Component({
  selector: 'lib-menu',
  standalone: true,
  imports: [CommonModule, FormsModule,DynamicMenu1Component],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  // ✅ INPUTS PARA CONFIGURACIÓN
  @Input() menuId: string = 'dashboard3-menu';
  @Input() menuConfig?: MenuConfig;
   @Input() userPermissions: string[] = ['admin.users.read', 'admin.settings.read', 'pages.crud.read'];
 @Input() showControls: boolean = true;
  @Input() showInfo: boolean = true;
  @Input() showEventLog: boolean = true;
  @Input() showConfig: boolean = true;
  @Input() initialConfig?: MenuConfig;

  // ✅ OUTPUTS PARA COMUNICACIÓN CON EL PADRE
  @Output() menuEvent = new EventEmitter<MenuEvent>();
  @Output() menuLoaded = new EventEmitter<MenuConfig>();
  @Output() menuError = new EventEmitter<string>();
  @Output() menuItemAdded = new EventEmitter<MenuItem>();
  @Output() menuRefreshed = new EventEmitter<void>();
  @Output() configApplied = new EventEmitter<MenuConfig>();

  // ✅ Propiedades internas
  menuItemCount = 0;
  menuStatus = 'Cargando...';
  eventLog: Array<{timestamp: Date, type: string, item: string}> = [];

  


  constructor(private menuService: DynamicMenuService) {}

  ngOnInit() {
    // Usar configuración inicial si se proporciona
    if (this.initialConfig) {
      this.menuConfig = { ...this.initialConfig };
    }
    
      if (this.menuConfig) {
            this.menuId = this.menuConfig.id || 'dashboard3-menu';
        }
        
        // Inicializar el menú dinámico
        this.initializeDynamicMenu();
    }

    private initializeDynamicMenu() {
        // Configurar el menú dinámico para el dashboard3
        this.menuService.updateMenuConfig(this.menuId, this.menuConfig!);
    }

  async loadMenuInfo() {
    try {
      const config = await this.menuService.getMenuConfig(this.menuId);
      this.menuItemCount = this.countMenuItems(config.items);
      this.menuStatus = 'Cargado correctamente';
      this.menuLoaded.emit(config);
    } catch (error) {
      this.menuStatus = 'Error al cargar';
      this.menuError.emit('Error al cargar el menú' + error);
    }
  }

  countMenuItems(items: MenuItem[]): number {
    let count = items.length;
    items.forEach(item => {
      if (item.items) {
        count += this.countMenuItems(item.items);
      }
    });
    return count;
  }

  onMenuChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.menuId = select.value;
    this.loadMenuInfo();
  }

  // onThemeChange(event: Event) {
  //   const select = event.target as HTMLSelectElement;
  //   this.menuConfig.theme = select.value as 'light' | 'dark';
  // }

  // onOrientationChange(event: Event) {
  //  // const select = event.target as HTMLSelectElement;
  //  // this.menuConfig.orientation = select.value as 'horizontal' | 'vertical';
  // }

  onMenuEvent(event: MenuEvent) {
    this.eventLog.unshift({
      timestamp: new Date(),
      type: event.type,
      item: event.item.label
    });

    // Limitar el log a 50 eventos
    if (this.eventLog.length > 50) {
      this.eventLog = this.eventLog.slice(0, 50);
    }

    // Propagar evento al componente padre
    this.menuEvent.emit(event);
  }

  onMenuLoaded(config: MenuConfig) {
    this.menuItemCount = this.countMenuItems(config.items);
    this.menuStatus = 'Cargado correctamente';
    this.menuLoaded.emit(config);
  }

  onMenuError(error: string) {
    this.menuStatus = `Error: ${error}`;
    this.menuError.emit(error);
  }

  async addMenuItem() {
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      label: `Nuevo Elemento ${this.menuItemCount + 1}`,
      icon: 'pi pi-plus',
      routerLink: ['/new-item'],
      type: 'item',
      order: this.menuItemCount + 1
    };

    try {
      await this.menuService.addMenuItem(this.menuId, newItem);
      this.loadMenuInfo();
      this.menuItemAdded.emit(newItem);
    } catch (error) {
      //eslint-disable-next-line no-console
      console.error('Error al agregar elemento:', error);
      this.menuError.emit('Error al agregar elemento del menú');
    }
  }

  refreshMenu() {
    this.menuService.clearCache(this.menuId);
    this.loadMenuInfo();
    this.menuRefreshed.emit();
  }

  applyCustomConfig() {
    //this.menuConfig.id = this.menuId;
  //  this.menuService.updateMenuConfig(this.menuId, this.menuConfig);
    this.loadMenuInfo();
    this.configApplied.emit(this.menuConfig);
  }

  // ✅ Métodos públicos para manipulación externa
  public setMenuId(menuId: string) {
    this.menuId = menuId;
    this.loadMenuInfo();
  }

  public setUserPermissions(permissions: string[]) {
    this.userPermissions = permissions;
  }

  public setMenuConfig(config: MenuConfig) {
    this.menuConfig = { ...config };
  }

  public clearEventLog() {
    this.eventLog = [];
  }

  // public getCurrentConfig(): MenuConfig {
  //   return { ...this.menuConfig };
  // }

  public getEventLog() {
    return [...this.eventLog];
  }

  
} 