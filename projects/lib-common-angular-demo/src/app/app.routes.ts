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
  {
    path: '',
    component: DaskBoard3,
    data: {
      menuConfig: defaultMenuConfig,
      userPermissions: permissionConfigs.user
    },
    children: [
      { 
        path: '', 
        component: DaskBoard3,
        data: {
          menuConfig: defaultMenuConfig,
          userPermissions: permissionConfigs.user
        }
      },
      { 
        path: 'admin', 
        component: DaskBoard3,
        data: {
          menuConfig: adminMenuConfig,
          userPermissions: permissionConfigs.admin
        }
      },
      { 
        path: 'minimal', 
        component: DaskBoard3,
        data: {
          menuConfig: minimalMenuConfig,
          userPermissions: permissionConfigs.guest
        }
      },
      { 
        path: 'user', 
        component: DaskBoard3,
        data: {
          menuConfig: userMenuConfig,
          userPermissions: permissionConfigs.user
        }
      },
      { 
        path: 'navigation', 
        component: DaskBoard3,
        data: {
          menuConfig: defaultMenuConfig,
          userPermissions: permissionConfigs.user
        }
      },
      { 
        path: 'pages', 
        loadChildren: () => import('./pages.routes'),
        data: {
          menuConfig: defaultMenuConfig,
          userPermissions: permissionConfigs.user
        }
      }
    ]
  }
];
