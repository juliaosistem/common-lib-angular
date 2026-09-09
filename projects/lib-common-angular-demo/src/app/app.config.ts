import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
// import Aura from '@primeng/themes/aura';
// import { providePrimeNG } from 'primeng/config';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';
import { provideRouter } from '@angular/router';
import { ProductosState } from 'lib-common-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),

    MessageService,
    ConfirmationService,
    importProvidersFrom(
      NgxsModule.forRoot([
        ProductosState
      ], {
        developmentMode: true,
        selectorOptions: {
          suppressErrors: false,
          injectContainerState: false
        }
      }),
      NgxsLoggerPluginModule.forRoot({
        disabled: false
      }),
      NgxsReduxDevtoolsPluginModule.forRoot({
        disabled: false
      })
    )
  ]
};
