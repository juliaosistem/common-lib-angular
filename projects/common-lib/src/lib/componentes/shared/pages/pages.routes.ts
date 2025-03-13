import { Routes } from '@angular/router';
import { Crud } from './crud/crud';


export default [  
    { path: '**', redirectTo: '/notfound' },
    {path:'crud' , component :Crud }
] as Routes;
