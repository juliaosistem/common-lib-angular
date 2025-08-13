
import {MenuItem,MenuConfig} from '@juliaosistem/core-dtos';


// Interfaz para el servicio de menú
export interface MenuService {
  getMenuConfig(menuId: string): Promise<MenuConfig>;
  updateMenuConfig(menuId: string, config: MenuConfig): Promise<void>;
  getMenuItems(menuId: string): Promise<MenuItem[]>;
  addMenuItem(menuId: string, item: MenuItem): Promise<void>;
  removeMenuItem(menuId: string, itemId: string): Promise<void>;
  updateMenuItem(menuId: string, itemId: string, item: Partial<MenuItem>): Promise<void>;
}

// Clase para manejar la lógica del menú
export class MenuManager {
  private config: MenuConfig;

  constructor(config: MenuConfig) {
    this.config = config;
  }

  // Obtener elementos visibles
  getVisibleItems(): MenuItem[] {
    return this.filterVisibleItems(this.config.items);
  }

  // Filtrar elementos visibles recursivamente
  private filterVisibleItems(items: MenuItem[]): MenuItem[] {
    return items
      .filter(item => item.visible !== false)
      .map(item => ({
        ...item,
        items: item.items ? this.filterVisibleItems(item.items) : undefined
      }));
  }

  // Obtener elementos ordenados
  getOrderedItems(): MenuItem[] {
    return this.sortItems(this.getVisibleItems());
  }

  // Ordenar elementos recursivamente
  private sortItems(items: MenuItem[]): MenuItem[] {
    return items
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(item => ({
        ...item,
        items: item.items ? this.sortItems(item.items) : undefined
      }));
  }

  // Buscar elemento por ID
  findItemById(itemId: string): MenuItem | null {
    return this.findItemRecursive(this.config.items, itemId);
  }

  // Búsqueda recursiva de elementos
  private findItemRecursive(items: MenuItem[], itemId: string): MenuItem | null {
    for (const item of items) {
      if (item.id === itemId) {
        return item;
      }
      if (item.items) {
        const found = this.findItemRecursive(item.items, itemId);
        if (found) return found;
      }
    }
    return null;
  }

  // Verificar permisos de un elemento
  hasPermission(item: MenuItem, userPermissions: string[]): boolean {
    if (!item.permissions || item.permissions.length === 0) {
      return true;
    }
    return item.permissions.some(permission => userPermissions.includes(permission));
  }

  // Filtrar elementos por permisos
  filterByPermissions(userPermissions: string[]): MenuItem[] {
    return this.filterItemsByPermissions(this.config.items, userPermissions);
  }

  // Filtrado recursivo por permisos
  private filterItemsByPermissions(items: MenuItem[], userPermissions: string[]): MenuItem[] {
    return items
      .filter(item => this.hasPermission(item, userPermissions))
      .map(item => ({
        ...item,
        items: item.items ? this.filterItemsByPermissions(item.items, userPermissions) : undefined
      }));
  }
} 

export {
  MenuItem,
  MenuConfig,}