import { Routes } from '@angular/router';
import { CrudComponent } from './pages/crud/crud.component';
import { MenuNavigationComponent } from './pages/menu-navigation/menu-navigation.component';
import { Notfound } from 'lib-common-angular';
import ecomerce1Routes from '../../../lib-common-angular/src/lib/componentes/shared/routes/ecomerce1.routes';

export default [
    { path: 'notfound', component: Notfound },
    { path: 'crud', component: CrudComponent },
    { path: 'menu-navigation', component: MenuNavigationComponent },
    { path: 'ecommerce1', children:[...ecomerce1Routes] },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
