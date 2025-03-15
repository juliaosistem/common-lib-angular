import { Routes } from '@angular/router';
import { Crud } from 'lib-common-angular';



export default [
    { path: 'crud', component: Crud },
   // { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
