import { Injectable, InjectionToken, Inject, Optional } from '@angular/core';

export type LibAppEnvironment = 'local' | 'development' | 'production';

export interface LibCommonConfig {
  environment?: LibAppEnvironment;
  apiGateway?: string;
  baseUrlProducts?: string;
  baseUrlAuth?: string;
  baseUrlUsers?: string;
  baseUrlCarrito?: string;
  baseUrlBusiness?: string;
  baseUrlCurrency?: string;
  baseUrlCategoryProduct?: string;
  baseUrlTipoCategoria?: string;
  baseUrlCrmWhats?: string;
  apiVersion?: string;
  timeout?: number;
  [key: string]: unknown;
}

export const LIB_COMMON_CONFIG = new InjectionToken<LibCommonConfig>('LIB_COMMON_CONFIG');

const DEFAULT_LOCAL_CONFIG: LibCommonConfig = {
  environment: 'local',
  apiGateway: 'http://localhost:3000',
  baseUrlProducts: 'http://localhost:3000/products',
  baseUrlAuth: 'http://localhost:3000/auth',
  baseUrlUsers: 'http://localhost:1212/user',
  baseUrlCarrito: 'http://localhost:3000/carrito',
  baseUrlBusiness: 'http://localhost:3000/Business',
  baseUrlCurrency: 'http://localhost:3000/Currency',
  baseUrlCategoryProduct: 'http://localhost:3000/category-products',
  baseUrlTipoCategoria: 'http://localhost:3000/tipo-categoria',
  baseUrlCrmWhats: 'http://localhost:8090',
  apiVersion: 'v1',
  timeout: 30000
};

@Injectable({
  providedIn: 'root'
})
export class LibConfigService {
  public config: LibCommonConfig = DEFAULT_LOCAL_CONFIG;

  constructor(@Optional() @Inject(LIB_COMMON_CONFIG) private injectedConfig: LibCommonConfig) {
    this.config = this.resolveConfig(injectedConfig);
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

  private resolveConfig(injectedConfig?: LibCommonConfig): LibCommonConfig {
    const mergedConfig = { ...DEFAULT_LOCAL_CONFIG, ...injectedConfig };

    if (mergedConfig.environment === 'local' || !mergedConfig.apiGateway) {
      return mergedConfig;
    }

    const apiGateway = mergedConfig.apiGateway.replace(/\/$/, '');

    return {
      ...mergedConfig,
      baseUrlProducts: mergedConfig.baseUrlProducts ?? `${apiGateway}/products`,
      baseUrlAuth: mergedConfig.baseUrlAuth ?? `${apiGateway}/auth`,
      baseUrlUsers: mergedConfig.baseUrlUsers ?? `${apiGateway}/user`,
      baseUrlCarrito: mergedConfig.baseUrlCarrito ?? `${apiGateway}/carrito`,
      baseUrlBusiness: mergedConfig.baseUrlBusiness ?? apiGateway,
      baseUrlCurrency: mergedConfig.baseUrlCurrency ?? `${apiGateway}/Currency`,
      baseUrlCategoryProduct: mergedConfig.baseUrlCategoryProduct ?? `${apiGateway}/category-products`,
      baseUrlTipoCategoria: mergedConfig.baseUrlTipoCategoria ?? `${apiGateway}/tipo-categoria`,
      baseUrlCrmWhats: mergedConfig.baseUrlCrmWhats ?? `${apiGateway}/whats`
    };
  }
}
