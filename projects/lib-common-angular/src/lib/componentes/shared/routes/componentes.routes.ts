import { Routes } from '@angular/router';

import { DetalleCarrito1Component } from '../molecules/productos/detalle-carrito-1/detalle-carrito-1.component';
import { CardProductos1Component } from '../molecules/productos/card-productos1/card-productos1.component';


export default [  
    { path: '**', redirectTo: '/notfound' },
  
     { path: 'detalle-carrito', component: DetalleCarrito1Component },
     {path:'card-productos', component: CardProductos1Component},
    
] as Routes;
