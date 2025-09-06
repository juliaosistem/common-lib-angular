import { Injectable, InjectionToken, Inject, Optional } from '@angular/core';

export interface LibCommonConfig {
  baseUrlProducts?: string;
  baseUrlAuth?: string;
  baseUrlUsers?: string;
  apiVersion?: string;
  timeout?: number;
  [key: string]: unknown;
}

export const LIB_COMMON_CONFIG = new InjectionToken<LibCommonConfig>('LIB_COMMON_CONFIG');

@Injectable({
  providedIn: 'root'
})
export class LibConfigService {
  private config: LibCommonConfig = {
    baseUrlProducts: 'http://localhost:3000/products',
    baseUrlAuth: 'http://localhost:3000/auth',
    baseUrlUsers: 'http://localhost:3000/users',
    apiVersion: 'v1',
    timeout: 30000
  };

  constructor(@Optional() @Inject(LIB_COMMON_CONFIG) private injectedConfig: LibCommonConfig) {
    if (injectedConfig) {
      this.config = { ...this.config, ...injectedConfig };
    }
  }

  get<T = unknown>(key: string): T {
    return this.config[key] as T;
  }

  getConfig(): LibCommonConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<LibCommonConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}
