import { Routes } from '@angular/router';
import { DaskBoard3 } from 'lib-common-angular';
import { 
  defaultMenuConfig, 
  adminMenuConfig, 
  minimalMenuConfig, 
  userMenuConfig,
  permissionConfigs 
} from './menu-configs';

export const routes: Routes = [
  // Sección por defecto — DaskBoard3 es el layout raíz, los hijos son contenido
  {
    path: '',
    component: DaskBoard3,
    data: {
      menuConfig: defaultMenuConfig,
      userPermissions: permissionConfigs.user
    },
    children: [
      { path: '', redirectTo: 'documentation/catalogo', pathMatch: 'full' },
      { 
        path: 'pages', 
        loadChildren: () => import('./pages.routes')
      },
      { 
        path: 'documentation', 
        loadChildren: () => import('./doc.routes')
      },
      { 
        path: 'componentes', 
        loadChildren: () => import('./componentes.routes')
      }
    ]
  },
  // Sección admin — layout propio con menú admin (no anidado)
  {
    path: 'admin',
    component: DaskBoard3,
    data: {
      menuConfig: adminMenuConfig,
      userPermissions: permissionConfigs.admin
    },
    children: [
      { path: '', redirectTo: 'pages', pathMatch: 'full' },
      { path: 'pages', loadChildren: () => import('./pages.routes') },
      { path: 'componentes', loadChildren: () => import('./componentes.routes') }
    ]
  },
  // Sección minimal
  {
    path: 'minimal',
    component: DaskBoard3,
    data: {
      menuConfig: minimalMenuConfig,
      userPermissions: permissionConfigs.guest
    },
    children: [
      { path: '', redirectTo: 'pages', pathMatch: 'full' },
      { path: 'pages', loadChildren: () => import('./pages.routes') }
    ]
  },
  // Sección user
  {
    path: 'user',
    component: DaskBoard3,
    data: {
      menuConfig: userMenuConfig,
      userPermissions: permissionConfigs.user
    },
    children: [
      { path: '', redirectTo: 'pages', pathMatch: 'full' },
      { path: 'pages', loadChildren: () => import('./pages.routes') }
    ]
  },
  // Sección navigation
  {
    path: 'navigation',
    component: DaskBoard3,
    data: {
      menuConfig: defaultMenuConfig,
      userPermissions: permissionConfigs.user
    },
    children: [
      { path: '', redirectTo: 'pages', pathMatch: 'full' },
      { path: 'pages', loadChildren: () => import('./pages.routes') }
    ]
  }
];
