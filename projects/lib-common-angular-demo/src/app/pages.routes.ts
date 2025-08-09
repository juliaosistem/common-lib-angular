import { Routes } from '@angular/router';
import { CrudComponent } from './pages/crud/crud.component';
import { MenuNavigationComponent } from './pages/menu-navigation/menu-navigation.component';

export default [
    { path: 'crud', component: CrudComponent },
    { path: 'menu-navigation', component: MenuNavigationComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
