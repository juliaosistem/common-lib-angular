import { DetalleCarritoDemo } from './componentes/shared/detalle-carrito-demo/detalle-carrito-demo';
import { Routes } from '@angular/router';
import {CardProductos1Component , Notfound} from 'lib-common-angular';
import { CrudComponent } from './componentes/crud/crud.component';
    
export default [
    
   { path: 'notfound', component: Notfound },
    { path: 'detalle-carrito', component: DetalleCarritoDemo },
    { path: 'card-productos', component: CardProductos1Component },
    { path: 'crud', component: CrudComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
