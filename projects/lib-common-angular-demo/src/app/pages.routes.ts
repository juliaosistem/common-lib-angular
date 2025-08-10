import { Routes } from '@angular/router';
import { CrudComponent } from './pages/crud/crud.component';
import { MenuNavigationComponent } from './pages/menu-navigation/menu-navigation.component';
import { DetalleCarrito1Component, Notfound } from 'lib-common-angular';

export default [
     { path: '/notfound', component: Notfound },
    { path: 'crud', component: CrudComponent },
    { path: 'menu-navigation', component: MenuNavigationComponent },
    { path: 'detalle-carrito', component: DetalleCarrito1Component },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
