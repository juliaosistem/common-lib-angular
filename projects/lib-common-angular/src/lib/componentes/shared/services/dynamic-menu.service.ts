import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, of, throwError } from 'rxjs';
// import { catchError, map, tap } from 'rxjs/operators';
import { MenuConfig, MenuItem, MenuService } from '../interfaces/menu.interface';

@Injectable({
  providedIn: 'root'
})
export class DynamicMenuService implements MenuService {
  // private readonly API_BASE_URL = '/api/menus';
  private menuCache = new Map<string, MenuConfig>();

  constructor(
    // private http: HttpClient
  ) {}

  // Obtener configuración del menú
  async getMenuConfig(menuId: string): Promise<MenuConfig> {
    // Verificar cache primero
    if (this.menuCache.has(menuId)) {
      return this.menuCache.get(menuId)!;
    }

    // Comentado: Petición HTTP real
    // try {
    //   const config = await this.http.get<MenuConfig>(`${this.API_BASE_URL}/${menuId}`).toPromise();
    //   if (config) {
    //     this.menuCache.set(menuId, config);
    //     return config;
    //   }
    //   throw new Error('Configuración de menú no encontrada');
    // } catch (error) {
    //   // Si falla la API, usar configuración por defecto
    //   return this.getDefaultMenuConfig(menuId);
    // }

    // Data estática para desarrollo
    const config = this.getDefaultMenuConfig(menuId);
    this.menuCache.set(menuId, config);
    return config;
  }

  // Actualizar configuración del menú
  async updateMenuConfig(menuId: string, config: MenuConfig): Promise<void> {
    // Comentado: Petición HTTP real
    // try {
    //   await this.http.put(`${this.API_BASE_URL}/${menuId}`, config).toPromise();
    //   this.menuCache.set(menuId, config);
    // } catch (error) {
    //   throw new Error('Error al actualizar configuración del menú');
    // }

    // Data estática para desarrollo
    this.menuCache.set(menuId, config);
    console.log(`Configuración actualizada para menú: ${menuId}`, config);
  }

  // Obtener elementos del menú
  async getMenuItems(menuId: string): Promise<MenuItem[]> {
    const config = await this.getMenuConfig(menuId);
    return config.items;
  }

  // Agregar elemento al menú
  async addMenuItem(menuId: string, item: MenuItem): Promise<void> {
    // Comentado: Petición HTTP real
    // try {
    //   const config = await this.getMenuConfig(menuId);
    //   config.items.push(item);
    //   await this.updateMenuConfig(menuId, config);
    // } catch (error) {
    //   throw new Error('Error al agregar elemento del menú');
    // }

    // Data estática para desarrollo
    try {
      const config = await this.getMenuConfig(menuId);
      config.items.push(item);
      await this.updateMenuConfig(menuId, config);
      console.log(`Elemento agregado al menú: ${menuId}`, item);
    } catch (error) {
      console.error(error);
      throw new Error('Error al agregar elemento del menú');
    }
  }

  // Eliminar elemento del menú
  async removeMenuItem(menuId: string, itemId: string): Promise<void> {
    // Comentado: Petición HTTP real
    // try {
    //   const config = await this.getMenuConfig(menuId);
    //   config.items = this.removeItemRecursive(config.items, itemId);
    //   await this.updateMenuConfig(menuId, config);
    // } catch (error) {
    //   throw new Error('Error al eliminar elemento del menú');
    // }

    // Data estática para desarrollo
    try {
      const config = await this.getMenuConfig(menuId);
      config.items = this.removeItemRecursive(config.items, itemId);
      await this.updateMenuConfig(menuId, config);
      console.log(`Elemento eliminado del menú: ${menuId}, itemId: ${itemId}`);
    } catch (error) {
      console.error(error);
      throw new Error('Error al eliminar elemento del menú');
    }
  }

  // Actualizar elemento del menú
  async updateMenuItem(menuId: string, itemId: string, updates: Partial<MenuItem>): Promise<void> {
    // Comentado: Petición HTTP real
    // try {
    //   const config = await this.getMenuConfig(menuId);
    //   this.updateItemRecursive(config.items, itemId, updates);
    //   await this.updateMenuConfig(menuId, config);
    // } catch (error) {
    //   throw new Error('Error al actualizar elemento del menú');
    // }

    // Data estática para desarrollo
    try {
      const config = await this.getMenuConfig(menuId);
      this.updateItemRecursive(config.items, itemId, updates);
      await this.updateMenuConfig(menuId, config);
      console.log(`Elemento actualizado en menú: ${menuId}, itemId: ${itemId}`, updates);
    } catch (error) {
      console.error(error);
      throw new Error('Error al actualizar elemento del menú');
    }
  }

  // Limpiar cache
  clearCache(menuId?: string): void {
    if (menuId) {
      this.menuCache.delete(menuId);
    } else {
      this.menuCache.clear();
    }
    console.log('Cache limpiado', menuId ? `para menú: ${menuId}` : 'completamente');
  }

  // Obtener configuración por defecto
  // eslint-disable-next-line max-lines-per-function
  private getDefaultMenuConfig(menuId: string): MenuConfig {
    const defaultConfigs: Record<string, MenuConfig> = {
      'main-menu': {
        id: 'main-menu',
        name: 'Menú Principal',
        items: [
          {
            id: 'home',
            label: 'Inicio',
            icon: 'pi pi-home',
            routerLink: ['/'],
            type: 'item',
            order: 1
          },
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: 'pi pi-chart-bar',
            routerLink: ['/dashboard'],
            type: 'item',
            order: 2
          },
          {
            id: 'separator-1',
            label: '',
            separator: true,
            type: 'separator',
            order: 3
          },
          {
            id: 'administration',
            label: 'Administración',
            icon: 'pi pi-cog',
            type: 'group',
            order: 4,
            items: [
              {
                id: 'users',
                label: 'Usuarios',
                icon: 'pi pi-users',
                routerLink: ['/admin/users'],
                type: 'item',
                order: 1,
                permissions: ['admin.users.read']
              },
              {
                id: 'roles',
                label: 'Roles',
                icon: 'pi pi-shield',
                routerLink: ['/admin/roles'],
                type: 'item',
                order: 2,
                permissions: ['admin.roles.read']
              }
            ]
          },
          {
            id: 'reports',
            label: 'Reportes',
            icon: 'pi pi-file',
            type: 'group',
            order: 5,
            items: [
              {
                id: 'sales-report',
                label: 'Reporte de Ventas',
                icon: 'pi pi-chart-line',
                routerLink: ['/reports/sales'],
                type: 'item',
                order: 1,
                permissions: ['reports.sales.read']
              },
              {
                id: 'inventory-report',
                label: 'Reporte de Inventario',
                icon: 'pi pi-box',
                routerLink: ['/reports/inventory'],
                type: 'item',
                order: 2,
                permissions: ['reports.inventory.read']
              }
            ]
          }
        ],
        theme: 'light',
        orientation: 'vertical',
        collapsible: true,
        showIcons: true,
        showBadges: true,
        maxDepth: 3
      },
      'sidebar-menu': {
        id: 'sidebar-menu',
        name: 'Menú Lateral',
        items: [
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: 'pi pi-home',
            routerLink: ['/dashboard'],
            type: 'item',
            order: 1
          },
          {
            id: 'profile',
            label: 'Perfil',
            icon: 'pi pi-user',
            routerLink: ['/profile'],
            type: 'item',
            order: 2
          },
          {
            id: 'settings',
            label: 'Configuración',
            icon: 'pi pi-cog',
            routerLink: ['/settings'],
            type: 'item',
            order: 3
          }
        ],
        theme: 'dark',
        orientation: 'vertical',
        collapsible: false,
        showIcons: true,
        showBadges: false,
        maxDepth: 2
      },
      'dashboard3-menu': {
        id: 'dashboard3-menu',
        name: 'Dashboard 3 Menu',
        items: [
          {
            id: 'home',
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            type: 'group',
            order: 1,
            items: [
              {
                id: 'dashboard',
                label: 'Dashboard',
                icon: 'pi pi-fw pi-home',
                routerLink: ['/'],
                type: 'item',
                order: 1
              },
              {
                id: 'crud',
                label: 'Crud',
                icon: 'pi pi-fw pi-pencil',
                routerLink: ['/pages/crud'],
                type: 'item',
                order: 2
              }
            ]
          },
          {
            id: 'pages',
            label: 'Pages',
            icon: 'pi pi-fw pi-briefcase',
            type: 'group',
            order: 2,
            items: [
              {
                id: 'menu-demo',
                label: 'Menu Demo',
                icon: 'pi pi-fw pi-bars',
                routerLink: ['/menu-demo'],
                type: 'item',
                order: 1
              },
              {
                id: 'dashboard-demo',
                label: 'Dashboard Demo',
                icon: 'pi pi-fw pi-chart-line',
                routerLink: ['/dashboard-demo'],
                type: 'item',
                order: 2
              }
            ]
          }
        ],
        theme: 'light',
        orientation: 'vertical',
        collapsible: true,
        showIcons: true,
        showBadges: true,
        maxDepth: 3
      }
    };

    return defaultConfigs[menuId] || {
      id: menuId,
      name: 'Menú',
      items: [],
      theme: 'light',
      orientation: 'vertical',
      collapsible: false,
      showIcons: true,
      showBadges: true,
      maxDepth: 3
    };
  }

  // Eliminar elemento recursivamente
  private removeItemRecursive(items: MenuItem[], itemId: string): MenuItem[] {
    return items.filter(item => {
      if (item.id === itemId) {
        return false;
      }
      if (item.items) {
        item.items = this.removeItemRecursive(item.items, itemId);
      }
      return true;
    });
  }

  // Actualizar elemento recursivamente
  private updateItemRecursive(items: MenuItem[], itemId: string, updates: Partial<MenuItem>): boolean {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === itemId) {
        items[i] = { ...items[i], ...updates };
        return true;
      }
      if (items[i].items && this.updateItemRecursive(items[i].items!, itemId, updates)) {
        return true;
      }
    }
    return false;
  }

  // Métodos adicionales para gestión avanzada
  async duplicateMenu(sourceMenuId: string, newMenuId: string, newName: string): Promise<MenuConfig> {
    const sourceConfig = await this.getMenuConfig(sourceMenuId);
    const newConfig: MenuConfig = {
      ...sourceConfig,
      id: newMenuId,
      name: newName
    };
    
    await this.updateMenuConfig(newMenuId, newConfig);
    console.log(`Menú duplicado: ${sourceMenuId} -> ${newMenuId}`);
    return newConfig;
  }

  async exportMenuConfig(menuId: string): Promise<string> {
    const config = await this.getMenuConfig(menuId);
    const jsonConfig = JSON.stringify(config, null, 2);
    console.log(`Configuración exportada para menú: ${menuId}`);
    return jsonConfig;
  }

  async importMenuConfig(menuId: string, configJson: string): Promise<void> {
    // Comentado: Validación HTTP real
    // try {
    //   const config = JSON.parse(configJson) as MenuConfig;
    //   config.id = menuId;
    //   await this.updateMenuConfig(menuId, config);
    // } catch (error) {
    //   throw new Error('Error al importar configuración del menú');
    // }

    // Data estática para desarrollo
    try {
      const config = JSON.parse(configJson) as MenuConfig;
      config.id = menuId;
      await this.updateMenuConfig(menuId, config);
      console.log(`Configuración importada para menú: ${menuId}`);
    } catch (error) {
      console.error(error);
      throw new Error('Error al importar configuración del menú');
    }
  }

  // Métodos para gestión de permisos
  async getMenuItemsByPermissions(menuId: string, permissions: string[]): Promise<MenuItem[]> {
    const config = await this.getMenuConfig(menuId);
    return this.filterItemsByPermissions(config.items, permissions);
  }

  private filterItemsByPermissions(items: MenuItem[], permissions: string[]): MenuItem[] {
    return items
      .filter(item => {
        if (!item.permissions || item.permissions.length === 0) {
          return true;
        }
        return item.permissions.some(permission => permissions.includes(permission));
      })
      .map(item => ({
        ...item,
        items: item.items ? this.filterItemsByPermissions(item.items, permissions) : undefined
      }));
  }
} 