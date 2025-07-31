import { Routes } from '@angular/router';
import { Crud } from './crud/crud.component';


export default [  
    { path: '**', redirectTo: '/notfound' },
    {path:'crud' , component :Crud }
] as Routes;
