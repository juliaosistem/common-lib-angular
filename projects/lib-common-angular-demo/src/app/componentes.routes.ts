import { DetalleCarritoDemo } from './componentes/shared/detalle-carrito-demo/detalle-carrito-demo';
import { Routes } from '@angular/router';
import { Notfound} from 'lib-common-angular';
import { CrudComponent } from './componentes/crud/crud.component';
import { CardCarritoDemo } from './componentes/shared/card-carrito-demo/card-carrito-demo';
import { MenuNavigationComponent } from './componentes/menu-navigation/menu-navigation.component';
    
export default [
    
   { path: 'notfound', component: Notfound },
   { path: 'crud', component: CrudComponent },
   { path: 'detalle-carrito', component: DetalleCarritoDemo },
   { path: 'card-productos', component: CardCarritoDemo },
   { path: 'menu-navigation', component: MenuNavigationComponent },
   { path: '', redirectTo: 'crud', pathMatch: 'full' },
   { path: '**', redirectTo: '/notfound' }
] as Routes;
