import { Routes } from '@angular/router';
import { CrudComponent } from './pages/crud/crud.component';




export default [
    { path: 'crud', component: CrudComponent },
   // { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
