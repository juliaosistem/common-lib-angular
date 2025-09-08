import { NgModule, ModuleWithProviders } from '@angular/core';
import { LibCommonConfig, LIB_COMMON_CONFIG, LibConfigService } from './lib-config.service';

@NgModule({})
export class LibConfigModule {
  static forRoot(config: LibCommonConfig): ModuleWithProviders<LibConfigModule> {
    return {
      ngModule: LibConfigModule,
      providers: [
        {
          provide: LIB_COMMON_CONFIG,
          useValue: config
        },
        LibConfigService
      ]
    };
  }
}
