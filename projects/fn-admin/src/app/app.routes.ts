import { Routes } from '@angular/router';
import { defaultMenuConfig, permissionConfigs } from './menu-configs';
import { DaskBoard3, Ecommerce1 } from 'lib-common-angular';

export const routes: Routes = [
    {
        path: '',
        component: Ecommerce1,

    },
      {
    path: 'admin',
    component: DaskBoard3,
    data: {
      menuConfig: defaultMenuConfig,
      userPermissions: permissionConfigs.user
    }
    // children: [
    //   { 
    //     path: '', 
    //     component: DaskBoard3,
    //     data: {
    //       menuConfig: defaultMenuConfig,
    //       userPermissions: permissionConfigs.user
    //     }
    //   }
    // ]
  }
];
