import { DetalleCarritoDemo } from './componentes/shared/detalle-carrito-demo/detalle-carrito-demo';
import { Routes } from '@angular/router';
import { Notfound} from 'lib-common-angular';
import { CrudComponent } from './componentes/crud/crud.component';
import { CardCarritoDemo } from './componentes/shared/card-carrito-demo/card-carrito-demo';
    
export default [
    
   { path: 'notfound', component: Notfound },
    { path: 'detalle-carrito', component: DetalleCarritoDemo },
    { path: 'card-productos', component: CardCarritoDemo},
    { path: 'crud', component: CrudComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
