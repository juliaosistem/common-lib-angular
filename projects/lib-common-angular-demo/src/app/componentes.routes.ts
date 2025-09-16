import { DetalleCarritoDemo } from './componentes/shared/detalle-carrito-demo/detalle-carrito-demo';
import { Routes } from '@angular/router';
import {CardProductos1Component , Notfound} from 'lib-common-angular';
    
export default [
    
   { path: 'notfound', component: Notfound },
    { path: 'detalle-carrito', component: DetalleCarritoDemo },
    { path: 'card-productos', component: CardProductos1Component },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
