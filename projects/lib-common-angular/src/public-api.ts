/*
 * Public API Surface of common-lib
 */

export * from './lib/common-lib.service';
export * from './lib/common-lib.component';


// Estados y acciones
/* export * from './lib/assets/state/tabla1.state';
export * from './lib/assets/state/tabla1.actions'; */

// componentes 

export * from './lib/componentes/shared/atoms/select-input1/select-input1.component'
export * from './lib/componentes/shared/atoms/button-action-edit1/button-action-edit1.component'
export * from './lib/componentes/shared/atoms/button-action-delete1/button-action-delete1.component'
export * from './lib/componentes/shared/atoms/button-add1/button-add1.component'
export * from './lib/componentes/daskboards/daskboard2/index2/index2.component';
export * from './lib/componentes/shared/molecules/tabla1/tabla1.component';
export * from './lib/componentes/shared/molecules/crud-dialog1/crud-dialog1.component';
export * from './lib/componentes/shared/interfaces/dynamic-field.interface';
export * from './lib/componentes/shared/services/dynamic-field.service';
export * from './lib/componentes/shared/pages/crud/crud.component';
export * from './lib/componentes/shared/molecules/product-dialog1/product-dialog1.component';
export * from './lib/componentes/shared/pages/notfound/notfound';

// Menú dinámico
export * from './lib/componentes/shared/interfaces/menu.interface';
export * from './lib/componentes/shared/atoms/menu-item1/menu-item1.component';
export * from './lib/componentes/daskboards/daskboard3/atoms/dynamic-menu1/dynamic-menu1.component';
export * from './lib/componentes/shared/services/dynamic-menu.service';
export * from './lib/componentes/daskboards/daskboard3/moleculas/menu/menu.component';

// Dashboard3 y sus componentes
export * from './lib/componentes/daskboards/daskboard3/moleculas/app.topbar';
export * from './lib/componentes/daskboards/daskboard3/moleculas/app.footer';
export * from './lib/componentes/daskboards/daskboard3/dashboard3-menu.config';
export * from './lib/componentes/daskboards/daskboard3/daskboard3';

//dashboard1 y sus componentes
export * from './lib/componentes/daskboards/daskboard1/componentes/pages/index1/index1.component';

// shared
export * from './lib/componentes/shared/molecules/productos/detalle-carrito-1/detalle-carrito-1.component';
export * from './lib/componentes/shared/molecules/productos/card-productos1/card-productos1.component';
export * from './lib/componentes/shared/molecules/section-filters-categories-productos/section-filters-categories-productos';

// Landing Pages
     // Ecommerce 1
         // Pages
export * from './lib/componentes/landingPages/pages/ecommerce1/home-ecommerce1/home-ecommerce1';
export * from './lib/componentes/landingPages/pages/ecommerce1/login-ecommerce1/login-ecommerce1';
export * from './lib/componentes/landingPages/pages/ecommerce1/register-ecommerce1/register-ecommerce1';
         // Atoms
export * from './lib/componentes/landingPages/atoms/ecommerce1/buttons-socialmedia-login/buttons-socialmedia-login';
export * from './lib/componentes/landingPages/atoms/ecommerce1/inputs-login-ecommerce1/inputs-login-ecommerce1';
export * from './lib/componentes/landingPages/atoms/ecommerce1/inputs-register-ecommerce1/inputs-register-ecommerce1';
        // Molecules
export * from './lib/componentes/landingPages/molecules/ecommerce1/footer-ecommerce1/footer-ecommerce1';
export * from './lib/componentes/landingPages/molecules/ecommerce1/bar-float-ecommerce1/bar-float-ecommerce1';
export * from './lib/componentes/landingPages/molecules/ecommerce1/form-auth-eccomerce1/form-auth-eccomerce1';
export * from './lib/componentes/landingPages/molecules/ecommerce1/header-ecommerce1/header-ecommerce1';

// Configuration
export * from './lib/config/lib-config.service';

//modulos
export * from './lib/modulos/primeg.module';
export * from './lib/config/lib-config.module';
export * from './lib/modulos/core.lib.module';

//servicios
export * from './lib/componentes/shared/services/product.service';

// Estados y acciones
export * from './lib/assets/state/productos.state';

export * from './lib/assets/state/usuarios.actions';
export * from './lib/assets/state/generic-crud.state';

//routes
export * from './lib/componentes/shared/routes/ecomerce1.routes';