import { MenuConfig } from 'lib-common-angular';

// Configuración de menú por defecto
export const defaultMenuConfig: MenuConfig = {
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
                  id: 'dashboard 3',
                  label: 'Dashboard 3',
                  icon: 'pi pi-fw pi-home',
                  routerLink: ['/'],
                  type: 'item',
                  order: 1
              },         
          ]
      },
      {
          id: 'ui-components',
          label: 'UI Components',
          icon: 'pi pi-fw pi-palette',
          type: 'group',
          order: 2,
          items: [
              {
                  id: 'card-productos',
                  label: 'card-productos',
                  icon: 'pi-shopping-cart',
                  routerLink: ['/componentes/card-productos'],
                  type: 'item',
                  order: 1
              },
                {
                  id: 'detalle-carrito',
                  label: 'Detalle Carrito',
                  icon: 'pi-shopping-cart',
                  routerLink: ['/componentes/detalle-carrito'],
                  type: 'item',
                  order: 2
              },
           
              {
                  id: 'table',
                  label: 'Table',
                  icon: 'pi pi-fw pi-table',
                  routerLink: ['/componentes/crud'],
                  type: 'group',
                  order: 5,   
                 items:[
                       {
                  id: 'crud',
                  label: 'Crud',
                  icon: 'pi pi-fw pi-pencil',
                  routerLink: ['/componentes/crud'],
                  type: 'item',
                  order: 1,
                  permissions: ['pages.crud.read']
              },  
                 ]
                },
              
              {
                  id: 'menu',
                  label: 'Menu',
                  icon: 'pi pi-fw pi-bars',
                  routerLink: ['/pages/menu-navigation'],
                  type: 'group',
                  order: 11,
                  items: [
                                    {
                            id: 'admin',
                            label: 'Admin',
                            icon: 'pi pi-fw pi-pencil',
                            routerLink: ['/admin'],
                            type: 'item',
                            order: 1,
                          },
                          {
                            id: 'minimal',
                            label: 'Minimal',
                            icon: 'pi pi-fw pi-pencil',
                            routerLink: ['/minimal'],
                            type: 'item',
                            order: 1,
                          },
                          {
                          id: 'user',
                          label: 'User',
                          icon: 'pi pi-fw pi-pencil',
                          routerLink: ['/user'],
                          type: 'item',
                          order: 1,
                        }
                  ]
              },
          ]
      },
      {
          id: 'pages',
          label: 'Pages',
          icon: 'pi pi-fw pi-briefcase',
          type: 'group',
          order: 3,
          items: [
              {
                  id: 'ecommerce1',
                  label: 'ecommerce1',
                  icon: 'pi pi-fw pi-globe',
                  routerLink: ['/pages/ecommerce1'],
                  type: 'item',
                  order: 1
              },
           
            
              {
                  id: 'not-found',
                  label: 'Not Found',
                  icon: 'pi pi-fw pi-exclamation-circle',
                  routerLink: ['/pages/notfound'],
                  type: 'item',
                  order: 5
              },
          ]
      },

        {
      id: 'doc',
      label: 'Documentación',
      icon: 'pi pi-fw pi-book',
      type: 'group',
      order: 3,
      items: [
        {
          id: 'crud-doc',
          label: 'Crud',
          icon: 'pi pi-fw pi-file',
          routerLink: ['/documentation/crud'],
          type: 'item',
          order: 1
        },
/*         {
          id: 'table-doc',
          label: 'Table Docs',
          icon: 'pi pi-fw pi-table',
          routerLink: ['/doc/table'],
          type: 'item',
          order: 2
        }, */
   /*      {
          id: 'form-doc',
          label: 'Form Docs',
          icon: 'pi pi-fw pi-file-edit',
          routerLink: ['/doc/form'],
          type: 'item',
          order: 3
        } */
      ]
    }
  ],
  theme: 'light',
  orientation: 'horizontal',
  collapsible: true,
  showIcons: true,
  showBadges: true,
  maxDepth: 4
};

// Configuración de menú de administrador
export const adminMenuConfig: MenuConfig = {
  id: 'admin-menu',
  name: 'Admin Menu',
  items: [
    {
      id: 'administration',
      label: 'Administración',
      icon: 'pi pi-fw pi-cog',
      type: 'group',
      order: 1,
      items: [
        {
          id: 'users',
          label: 'Usuarios',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/admin/users'],
          type: 'item',
          order: 1,
          permissions: ['admin.users.read']
        },
        {
          id: 'roles',
          label: 'Roles',
          icon: 'pi pi-fw pi-shield',
          routerLink: ['/admin/roles'],
          type: 'item',
          order: 2,
          permissions: ['admin.roles.read']
        },
        {
          id: 'settings',
          label: 'Configuración',
          icon: 'pi pi-fw pi-cog',
          routerLink: ['/admin/settings'],
          type: 'item',
          order: 3,
          permissions: ['admin.settings.read']
        }
      ]
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: 'pi pi-fw pi-file',
      type: 'group',
      order: 2,
      items: [
        {
          id: 'sales-report',
          label: 'Reporte de Ventas',
          icon: 'pi pi-fw pi-chart-line',
          routerLink: ['/reports/sales'],
          type: 'item',
          order: 1,
          permissions: ['reports.sales.read']
        },
        {
          id: 'inventory-report',
          label: 'Reporte de Inventario',
          icon: 'pi pi-fw pi-box',
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
};

// Configuración de menú minimalista
export const minimalMenuConfig: MenuConfig = {
  id: 'minimal-menu',
  name: 'Minimal Menu',
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
      id: 'profile',
      label: 'Perfil',
      icon: 'pi pi-fw pi-user',
      routerLink: ['/profile'],
      type: 'item',
      order: 2
    }
  ],
  theme: 'light',
  orientation: 'vertical',
  collapsible: false,
  showIcons: true,
  showBadges: false,
  maxDepth: 2
};

// Configuración de menú de usuario
export const userMenuConfig: MenuConfig = {
  id: 'user-menu',
  name: 'User Menu',
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
      id: 'pages',
      label: 'Páginas',
      icon: 'pi pi-fw pi-briefcase',
      type: 'group',
      order: 2,
      items: [
        {
          id: 'crud',
          label: 'Crud',
          icon: 'pi pi-fw pi-pencil',
          routerLink: ['/componentes/crud'],
          type: 'item',
          order: 1
        },
        {
          id: 'menu-demo',
          label: 'Menu Demo',
          icon: 'pi pi-fw pi-bars',
          routerLink: ['/menu-demo'],
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
};

// Configuraciones de permisos predefinidas
export const permissionConfigs = {
  admin: ['admin.users.read', 'admin.roles.read', 'admin.settings.read', 'reports.sales.read', 'reports.inventory.read'],
  user: ['pages.crud.read', 'pages.menu-demo.read'],
  guest: ['pages.crud.read'],
  custom: ['admin.users.read', 'pages.crud.read', 'reports.sales.read']
}; 