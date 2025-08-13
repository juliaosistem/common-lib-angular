import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering()
    // If you need routing, configure it with the correct provider from the appropriate Angular package
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
