import { Routes } from '@angular/router';
import { CrudComponent } from './componentes/crud/crud.component';
import { MenuNavigationComponent } from './componentes/menu-navigation/menu-navigation.component';
import { Notfound ,ecomerce1Routes} from 'lib-common-angular';

export default [
    { path: 'notfound', component: Notfound },
    { path: 'crud', component: CrudComponent },
    { path: 'menu-navigation', component: MenuNavigationComponent },
    { path: 'ecommerce1', children:[...ecomerce1Routes] },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
