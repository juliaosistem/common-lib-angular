import { Routes } from '@angular/router';
import { Crud } from './crud/crud.component';
import { DetalleCarrito1Component } from '../../daskboards/daskboard3/moleculas/productos/detalle-carrito-1/detalle-carrito-1.component';


export default [  
    { path: '**', redirectTo: '/notfound' },
    {path:'crud' , component :Crud },
     { path: 'detalle-carrito', component: DetalleCarrito1Component },
    
] as Routes;
