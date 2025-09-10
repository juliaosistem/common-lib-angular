import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
// import Aura from '@primeng/themes/aura';
// import { providePrimeNG } from 'primeng/config';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), 
      provideAnimations(),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),

    MessageService,
    ConfirmationService,
  ]
};
