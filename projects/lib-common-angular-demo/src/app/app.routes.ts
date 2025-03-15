import { Routes } from '@angular/router';
import { DaskBoard3 } from 'lib-common-angular';

export const routes: Routes = [   {
    path: '',
    component: DaskBoard3,
    children: [
        { path: '', component: DaskBoard3 },
        { path: 'pages', loadChildren: () => import('./pages.routes') }
    ]
},];
