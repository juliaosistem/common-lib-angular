import { Injectable } from '@angular/core';
import { Observable, from, of, throwError } from 'rxjs';
import { LibConfigService } from '../config/lib-config.service';

/** Version del Graph API con la que se inicializa el SDK del navegador. */
const DEFAULT_SDK_VERSION = 'v21.0';

/** Permisos minimos requeridos para poder aprovisionar el usuario local. */
const DEFAULT_SCOPE = 'public_profile,email';

interface FacebookAuthResponse {
  accessToken?: string;
}

interface FacebookLoginResponse {
  status?: string;
  authResponse?: FacebookAuthResponse;
}

interface FacebookSdk {
  init(params: Record<string, unknown>): void;
  login(callback: (response: FacebookLoginResponse) => void, options: { scope: string }): void;
  logout(callback: () => void): void;
}

declare global {
  interface Window {
    FB?: FacebookSdk;
    fbAsyncInit?: () => void;
  }
}

/**
 * Carga perezosa del SDK de Facebook y apertura del popup de autenticacion.
 * Devuelve unicamente el access token; la validacion real ocurre en el backend.
 */
@Injectable({ providedIn: 'root' })
export class FacebookSdkService {
  private loader?: Promise<FacebookSdk>;

  constructor(private readonly config: LibConfigService) {}

  /** Indica si hay un appId configurado para habilitar el boton en la UI. */
  get isConfigured(): boolean {
    return !!this.appId();
  }

  /**
   * Abre el dialogo de Facebook y emite el access token del usuario.
   *
   * @returns observable con el access token o error cuando el usuario cancela
   */
  login(): Observable<string> {
    if (!this.isConfigured) {
      return throwError(() => new Error('Facebook no está configurado en esta aplicación'));
    }

    return from(this.loadSdk().then((sdk) => this.requestToken(sdk)));
  }

  /**
   * Cierra la sesion del SDK en el navegador sin afectar la sesion del backend.
   *
   * @returns observable que completa tras el logout local del SDK
   */
  logout(): Observable<void> {
    const sdk = typeof window === 'undefined' ? undefined : window.FB;
    if (!sdk) {
      return of(undefined);
    }
    return from(new Promise<void>((resolve) => sdk.logout(() => resolve())));
  }

  /**
   * Lanza el popup de login y resuelve el token entregado por el SDK.
   *
   * @param sdk instancia del SDK ya inicializada
   * @returns promesa con el access token
   */
  private requestToken(sdk: FacebookSdk): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      sdk.login((response) => {
        const token = response?.authResponse?.accessToken;
        if (response?.status === 'connected' && token) {
          resolve(token);
          return;
        }
        reject(new Error('El usuario canceló el acceso con Facebook'));
      }, { scope: this.scope() });
    });
  }

  /**
   * Inyecta el script del SDK una sola vez y lo inicializa con el appId configurado.
   *
   * @returns promesa con la instancia del SDK lista para usar
   */
  private loadSdk(): Promise<FacebookSdk> {
    if (this.loader) {
      return this.loader;
    }

    this.loader = new Promise<FacebookSdk>((resolve, reject) => {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        reject(new Error('SDK de Facebook no disponible fuera del navegador'));
        return;
      }
      if (window.FB) {
        resolve(window.FB);
        return;
      }
      window.fbAsyncInit = () => this.initSdk(resolve, reject);
      this.appendScript(reject);
    });

    return this.loader;
  }

  /**
   * Inicializa el SDK una vez cargado el script.
   *
   * @param resolve callback de exito de la promesa de carga
   * @param reject callback de error de la promesa de carga
   */
  private initSdk(resolve: (sdk: FacebookSdk) => void, reject: (error: Error) => void): void {
    const sdk = window.FB;
    if (!sdk) {
      reject(new Error('El SDK de Facebook no se inicializó correctamente'));
      return;
    }
    sdk.init({ appId: this.appId(), cookie: true, xfbml: false, version: this.version() });
    resolve(sdk);
  }

  /**
   * Agrega el script oficial del SDK al documento.
   *
   * @param reject callback de error cuando el script no carga
   */
  private appendScript(reject: (error: Error) => void): void {
    const script = document.createElement('script');
    script.src = `https://connect.facebook.net/es_LA/sdk.js`;
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.onerror = () => {
      this.loader = undefined;
      reject(new Error('No fue posible cargar el SDK de Facebook'));
    };
    document.head.appendChild(script);
  }

  private appId(): string {
    return String(this.config.get('facebookAppId') ?? '').trim();
  }

  private version(): string {
    return String(this.config.get('facebookSdkVersion') ?? '').trim() || DEFAULT_SDK_VERSION;
  }

  private scope(): string {
    return String(this.config.get('facebookScope') ?? '').trim() || DEFAULT_SCOPE;
  }
}
