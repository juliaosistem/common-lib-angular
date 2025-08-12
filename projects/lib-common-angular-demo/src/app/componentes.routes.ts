import { Routes } from '@angular/router';
import { DetalleCarrito1Component ,CardProductos1Component , Notfound} from 'lib-common-angular';
    
export default [
    
   { path: 'notfound', component: Notfound },
    { path: 'detalle-carrito', component: DetalleCarrito1Component },
    { path: 'card-productos', component: CardProductos1Component },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
