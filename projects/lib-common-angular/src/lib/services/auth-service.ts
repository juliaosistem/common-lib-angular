import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { LoginDTO, RegisterUserDTO } from '@juliaosistem/core-dtos';
import { Login, AddUser } from '../assets/state/usuarios.actions';
import { UsuariosState } from '../assets/state/usuarios.state';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthResponseDTO } from '@juliaosistem/core-dtos';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { decodeBusinessToken, getSessionToken } from '../utils/business-token.util';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly loginState$ = new BehaviorSubject<boolean>(this.hasValidSession());

  constructor(private store: Store, private router: Router) {}

  get isLoggedIn$(): Observable<boolean> {
    return this.loginState$.asObservable();
  }

  getIsLoggedInSnapshot(): boolean {
    return this.loginState$.value;
  }

  rehydrateSession(): void {
    this.loginState$.next(this.hasValidSession());
  }

  /**
   * Realiza el login y maneja toda la lógica de validación y navegación.
   * Devuelve un observable con { success: boolean, errorMsg?: string }
   */
  // eslint-disable-next-line max-lines-per-function
  login(login: LoginDTO): Observable<{ success: boolean; errorMsg?: string }> {
    return this.store.dispatch(new Login(login)).pipe(
      map(() => {
        const authResponse = this.store.selectSnapshot<PlantillaResponse<AuthResponseDTO>>(UsuariosState.Login);
        const resolvedToken = this.resolveToken(authResponse?.data);

        if (resolvedToken) {
          this.persistSession(authResponse?.data, resolvedToken);
          this.loginState$.next(true);
          this.router.navigate(['/home']);
          return { success: true };
        }

        this.clearSession();
        this.loginState$.next(false);
        return {
          success: false,
          errorMsg: authResponse && authResponse.message ? authResponse.message : 'Credenciales inválidas',
        };
      }),
      catchError((err) => {
        this.clearSession();
        this.loginState$.next(false);
        return throwError(() => ({
          success: false,
          errorMsg: err?.error?.message || 'Error de autenticación',
        }));
      })
    );
  }

  logout(): void {
    this.clearSession();
    this.loginState$.next(false);
  }

  private resolveToken(data?: AuthResponseDTO): string | null {
    const businessToken = data?.businessToken;
    const keycloakToken = data?.keycloakToken?.access_token;
    return businessToken || keycloakToken || null;
  }

  private persistSession(data: AuthResponseDTO | undefined, token: string): void {
    if (!this.isBrowser()) {
      return;
    }

    sessionStorage.setItem('token', token);
    sessionStorage.setItem('isLogin', 'true');

    if (data?.businessToken) {
      sessionStorage.setItem('businessToken', data.businessToken);
    }
    if (data?.keycloakToken?.access_token) {
      sessionStorage.setItem('keycloakAccessToken', data.keycloakToken.access_token);
    }

    this.persistClaimsData(token);
  }

  private persistClaimsData(token: string): void {
    const claims = decodeBusinessToken(token);
    if (!claims) {
      return;
    }

    this.persistSessionValue('idbusiness', claims?.['idBusiness']);
    this.persistSessionValue('idDatosUsuario', claims?.id || claims?.sub || claims?.['idDatosUsuario']);
    this.persistSessionValue('usuario', claims?.email || claims?.usuario || claims?.username);
  }

  private persistSessionValue(key: string, value: unknown): void {
    if (value === undefined || value === null || value === '') {
      return;
    }

    sessionStorage.setItem(key, String(value));
  }

  private hasValidSession(): boolean {
    if (!this.isBrowser()) {
      return false;
    }

    const token = getSessionToken();
    if (!token) {
      return false;
    }

    const claims = decodeBusinessToken(token);
    if (!claims?.exp) {
      return true;
    }

    return Date.now() < claims.exp * 1000;
  }

  private clearSession(): void {
    if (!this.isBrowser()) {
      return;
    }

    const keys = ['token', 'businessToken', 'keycloakAccessToken', 'idbusiness', 'idDatosUsuario', 'usuario', 'isLogin'];
    keys.forEach((key) => sessionStorage.removeItem(key));
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
  }

  register(registerUser: RegisterUserDTO): Observable<unknown> {
    const queryParams = {
      ip: '127.0.0.1',
      dominio: 'app',
      usuario: 'admin',
      topic: 'usuarios',
      proceso: 'guardar',
      idbusiness: Number(sessionStorage.getItem('idbusiness')) || 0,
    };
    return this.store.dispatch(new AddUser(registerUser, queryParams)).pipe(
      map(() => this.store.selectSnapshot(UsuariosState.getUsuarios))
    );
  }
}
