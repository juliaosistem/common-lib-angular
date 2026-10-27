import { Routes } from '@angular/router';
import { Notfound ,ecomerce1Routes} from 'lib-common-angular';

export default [
    { path: 'notfound', component: Notfound },
    { path: 'ecommerce1', children:[...ecomerce1Routes] },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
