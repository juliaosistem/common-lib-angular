/*
 * Public API Surface of common-lib
 */


export * from './lib/common-lib.service';
export * from './lib/common-lib.component';


// Estados y acciones
/* export * from './lib/assets/state/tabla1.state';
export * from './lib/assets/state/tabla1.actions'; */

// componentes 



export * from './lib/componentes/shared/pages/crud/crud.component';
export * from './lib/componentes/shared/pages/crud/doc/crud-doc.component';

export * from './lib/componentes/shared/atoms/select-input1/select-input1.component'
export * from './lib/componentes/shared/atoms/button-action-edit1/button-action-edit1.component'
export * from './lib/componentes/shared/atoms/button-action-delete1/button-action-delete1.component'
export * from './lib/componentes/shared/atoms/button-add1/button-add1.component'
export * from './lib/componentes/daskboards/daskboard2/index2/index2.component';
export * from './lib/componentes/shared/molecules/tabla1/tabla1.component';
export * from './lib/componentes/shared/molecules/crud-dialog1/crud-dialog1.component';
export * from './lib/componentes/shared/interfaces/dynamic-field.interface';
export * from './lib/componentes/shared/services/dynamic-field.service';
export * from './lib/componentes/shared/molecules/product-dialog1/product-dialog1.component';
export * from './lib/componentes/shared/pages/notfound/notfound';
export * from './lib/componentes/shared/molecules/inflatable-customizer/customizer.component';
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
export * from './lib/componentes/daskboards/daskboard3/moleculas/menu/menu.component';

//dashboard1 y sus componentes
export * from './lib/componentes/daskboards/daskboard1/componentes/pages/index1/index1.component';

// shared
export * from './lib/componentes/shared/molecules/productos/detalle-carrito-1/detalle-carrito-1.component';
export * from './lib/componentes/shared/molecules/productos/card-productos1/card-productos1.component';
export * from './lib/componentes/shared/molecules/section-filters-categories-productos/section-filters-categories-productos';
export * from './lib/componentes/shared/terminal/terminal';

// shared atomos
export * from './lib/componentes/shared/atoms/loading-zigma/loading-zigma';
export * from './lib/componentes/shared/atoms/button-action-delete1/button-action-delete1.component';
export * from './lib/componentes/shared/atoms/button-action-edit1/button-action-edit1.component';
export * from './lib/componentes/shared/atoms/button-add1/button-add1.component';
export * from './lib/componentes/shared/atoms/select-input1/select-input1.component';
export * from './lib/componentes/shared/atoms/paginator-pg/paginator-pg.component';
export * from './lib/componentes/shared/atoms/sh-wats-button-card/sh-wats-button-card';
export * from './lib/componentes/shared/atoms/button-add-to-card1/button-add-to-card1';
// shared pages
export * from './lib/componentes/shared/pages/notfound/notfound';

// shared molecules
export * from './lib/componentes/shared/molecules/crud-dialog1/crud-dialog1.component';
export * from './lib/componentes/shared/molecules/tabla1/tabla1.component';
export * from './lib/componentes/shared/molecules/product-dialog1/product-dialog1.component';
export * from './lib/componentes/shared/molecules/inflatable-customizer/customizer.component';
export * from './lib/componentes/shared/molecules/section-filters-categories-productos/section-filters-categories-productos';
export * from './lib/componentes/shared/molecules/productos/detalle-carrito-1/detalle-carrito-1.component';
export * from './lib/componentes/shared/molecules/productos/card-productos1/card-productos1.component';
export * from './lib/componentes/shared/molecules/section-add-cards-buttons/section-add-cards-buttons';

// Landing Pages
export * from './lib/componentes/landingPages/pages/ecommerce1/ecommerce1';
     // Ecommerce 1
         // Pages
export * from './lib/componentes/landingPages/pages/ecommerce1/home-ecommerce1/home-ecommerce1';
export * from './lib/componentes/landingPages/pages/ecommerce1/login-ecommerce1/login-ecommerce1';
export * from './lib/componentes/landingPages/pages/ecommerce1/register-ecommerce1/register-ecommerce1';
export * from './lib/componentes/landingPages/pages/ecommerce1/product-detail-lib/product-detail-lib';
         // Atoms
export * from './lib/componentes/landingPages/atoms/ecommerce1/buttons-socialmedia-login/buttons-socialmedia-login';
export * from './lib/componentes/landingPages/atoms/ecommerce1/inputs-login-ecommerce1/inputs-login-ecommerce1';
export * from './lib/componentes/landingPages/atoms/ecommerce1/inputs-register-ecommerce1/inputs-register-ecommerce1';
export * from './lib/componentes/landingPages/atoms/ecommerce1/header-top-ecommerce1/header-top-ecommerce1';
        // Molecules
export * from './lib/componentes/landingPages/molecules/ecommerce1/footer-ecommerce1/footer-ecommerce1';
export * from './lib/componentes/landingPages/molecules/ecommerce1/bar-float-ecommerce1/bar-float-ecommerce1';
export * from './lib/componentes/landingPages/molecules/ecommerce1/form-auth-eccomerce1/form-auth-eccomerce1';
export * from './lib/componentes/landingPages/molecules/ecommerce1/header-ecommerce1/header-ecommerce1';
export * from './lib/componentes/landingPages/molecules/ecommerce1/hero-section-ecommerce1/hero-section-ecommerce1';
export * from './lib/componentes/landingPages/molecules/ecommerce1/section-images-instagram-ecommerce1/section-images-instagram-ecommerce1';

// Configuration
export * from './lib/config/lib-config.service';

//modulos
export * from './lib/modulos/primeg.module';
export * from './lib/config/lib-config.module';
export * from './lib/modulos/core.lib.module';

//servicios
export * from './lib/componentes/shared/services/product.service';
export * from './lib/componentes/shared/services/categorias-productos.service';
export * from './lib/componentes/shared/services/meta-data.service.ts/meta-data.service';


// Estados y acciones
export * from './lib/assets/state/state-generic/generic-crud.state';
export * from './lib/assets/state/productos.state';
export * from './lib/assets/state/currency.state';
export * from './lib/assets/state/business.state';
export * from './lib/assets/state/usuarios.actions';
export * from './lib/assets/state/categorias-productos.state'

//routes
export * from './lib/componentes/shared/routes/ecomerce1.routes';