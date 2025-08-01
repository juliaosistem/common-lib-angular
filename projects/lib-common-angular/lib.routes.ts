import { Routes } from '@angular/router';
import { Index2Component } from './src/public-api';
import { DaskBoard3 } from './src/lib/componentes/daskboards/daskboard3/componentes/daskboard3';
import { Notfound } from './src/lib/componentes/shared/pages/notfound/notfound';


export const routes: Routes = [
   // {path:'dask1', component: Index2Component},
    {path:'index1', component: Index2Component},
    {
        path: '',
        component: DaskBoard3,
        children: [
            { path: 'pages', loadChildren: () => import('./src/lib/componentes/shared/pages/pages.routes') }
        ]
    },
    { path: 'notfound', component: Notfound },
    //{ path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }

];
