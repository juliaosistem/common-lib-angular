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

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { MessageService } from 'primeng/api';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    MessageService,
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
