import { Routes } from '@angular/router';
import { CrudComponent } from './pages/crud/crud.component';
import { MenuNavigationComponent } from './pages/menu-navigation/menu-navigation.component';
import { Notfound } from 'lib-common-angular';

export default [
    { path: 'notfound', component: Notfound },
    { path: 'crud', component: CrudComponent },
    { path: 'menu-navigation', component: MenuNavigationComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
