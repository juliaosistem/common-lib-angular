import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { importProvidersFrom } from '@angular/core';

// Importar los states
import { ProductosState } from 'lib-common-angular';
import { CategoriasProductosState } from 'lib-common-angular';


import { routes } from './app/app.routes';
import { App } from './app/app';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    // Configurar NGXS
    importProvidersFrom(
      NgxsModule.forRoot([
        ProductosState,
        CategoriasProductosState
      ], {
        developmentMode: true, // Solo en desarrollo
        selectorOptions: {
          suppressErrors: false,
          injectContainerState: false
        }
      }),
      
      // Plugins opcionales (solo en desarrollo)
      NgxsLoggerPluginModule.forRoot({
        disabled: false // Cambiar a true en producción
      }),
      
      NgxsReduxDevtoolsPluginModule.forRoot({
        disabled: false // Cambiar a true en producción
      })
    )
  ]
}).catch(err => console.error(err));
