import { Routes } from '@angular/router';
import { LoginEcommerce1 } from '../../landingPages/pages/ecommerce1/login-ecommerce1/login-ecommerce1';
import { RegisterEcommerce1 } from '../../landingPages/pages/ecommerce1/register-ecommerce1/register-ecommerce1';
import { Ecommerce1 } from '../../landingPages/pages/ecommerce1/ecommerce1';
import { HomeEcommerce1 } from '../../landingPages/pages/ecommerce1/home-ecommerce1/home-ecommerce1';

export const ecomerce1Routes: Routes = [
  { path: '', component: Ecommerce1, children: [
      { path: '', component: HomeEcommerce1 },
      { path: 'login', component: LoginEcommerce1 },
      { path: 'register', component: RegisterEcommerce1 },
        // Ruta de personalización/el detalle interno se elimina para evitar colisiones con las rutas del front.

    ]
  }
] as Routes;