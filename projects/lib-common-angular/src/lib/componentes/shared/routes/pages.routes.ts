import { Routes } from '@angular/router';
import { Crud } from '../pages/crud/crud.component';
import { Ecommerce1 } from '../../landingPages/pages/ecommerce1/ecommerce1';


export default [  
    { path: '**', redirectTo: '/notfound' },
    {path:'crud' , component :Crud },
    {
            path: 'ecomerce1',
            component: Ecommerce1,
            children: [
                { path: '', loadChildren: () => import('../routes/ecomerce1.routes')
                }
            ]
        },

    
] as Routes;
