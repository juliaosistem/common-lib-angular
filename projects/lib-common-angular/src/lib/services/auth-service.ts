import { Injectable, Injector } from '@angular/core';
import { Store } from '@ngxs/store';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginDTO, RegisterUserDTO } from '@juliaosistem/core-dtos';
import { Login, AddUser } from '../assets/state/usuarios.actions';
import { UsuariosState } from '../assets/state/usuarios.state';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponseDTO } from '@juliaosistem/core-dtos';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { decodeBusinessToken, getSessionToken } from '../utils/business-token.util';
import { getLibraryInjector } from '../utils/library-injector';
import { LibConfigService } from '../config/lib-config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly loginState$ = new BehaviorSubject<boolean>(this.hasValidSession());

  constructor(private readonly injector: Injector, private router: Router) {}

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
   * Devuelve la respuesta cruda de autenticación.
   */
  // eslint-disable-next-line max-lines-per-function
  login(login: LoginDTO): Observable<PlantillaResponse<AuthResponseDTO>> {
    return this.getStore().dispatch(new Login(login)).pipe(
      map(() => {
        const authResponse = this.getStore().selectSnapshot<PlantillaResponse<AuthResponseDTO>>(UsuariosState.Login);
        const resolvedToken = this.resolveToken(authResponse?.data);

        if (resolvedToken) {
          this.persistSession(authResponse?.data, resolvedToken);
          this.loginState$.next(true);
          this.router.navigate(['/home']);
          return authResponse as PlantillaResponse<AuthResponseDTO>;
        }

        this.clearSession();
        this.loginState$.next(false);
        return authResponse as PlantillaResponse<AuthResponseDTO>;
      }),
      catchError((err) => {
        this.clearSession();
        this.loginState$.next(false);
        return of({
          data: undefined,
          dataList: undefined,
          httpStatus: err?.error?.httpStatus || err?.status || 500,
          message: err?.error?.message || err?.message || 'Error de autenticación',
          rta: false,
        } as PlantillaResponse<AuthResponseDTO>);
      })
    );
  }

  logout(): Observable<boolean> {
    return this.logoutRemote().pipe(
      map(() => true),
      catchError(() => of(false)),
      finalize(() => {
        this.clearSession();
        this.loginState$.next(false);
        this.router.navigate(['/login']);
      })
    );
  }

  private logoutRemote(): Observable<unknown> {
    try {
      const injector = getLibraryInjector();
      const http = injector.get(HttpClient);
      const config = injector.get(LibConfigService);
      const baseUrl = String(config.get('baseUrlUsers') ?? '').replace(/\/$/, '');
      const url = `${baseUrl}/logout`;
      return http.post(url, this.buildLogoutPayload(), { headers: this.buildLogoutHeaders() });
    } catch {
      return of(null);
    }
  }

  private buildLogoutPayload(): { token: string; refreshToken: string } {
    return {
      token: sessionStorage.getItem('token') ?? '',
      refreshToken: sessionStorage.getItem('keycloakRefreshToken') ?? '',
    };
  }

  private buildLogoutHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token') || sessionStorage.getItem('businessToken') || '';
    const authToken = sessionStorage.getItem('keycloakAccessToken') || token;
    let headers = new HttpHeaders({ token });
    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    }
    return headers;
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

    this.persistAuthToken('token', token);
    sessionStorage.setItem('isLogin', 'true');
    localStorage.setItem('isLogin', 'true');
    this.persistOptionalTokens(data);

    this.persistClaimsData(data, token);
  }

  private persistOptionalTokens(data: AuthResponseDTO | undefined): void {
    this.persistAuthToken('businessToken', data?.businessToken);
    this.persistAuthToken('keycloakAccessToken', data?.keycloakToken?.access_token);
    this.persistAuthToken('keycloakRefreshToken', data?.keycloakToken?.refresh_token);
  }

  private persistAuthToken(key: string, value?: string): void {
    if (!value) {
      return;
    }
    this.setStorageValue(key, value);
    sessionStorage.setItem(key, value);
    localStorage.setItem(key, value);
  }

  private persistClaimsData(data: AuthResponseDTO | undefined, token: string): void {
    const claims = decodeBusinessToken(token);
    if (!claims) {
      return;
    }

    const keycloakClaims = decodeBusinessToken(data?.keycloakToken?.access_token);
    const resolvedEmail = String(
      claims.email
      || claims.usuario
      || claims.username
      || claims.sub
      || keycloakClaims?.email
        || keycloakClaims?.['preferred_username']
      || ''
    ).trim();

    this.persistSessionValue('idbusiness', claims['idBusiness']);
    this.persistSessionValue('idDatosUsuario', claims.id || claims.sub || claims['idDatosUsuario']);
    this.persistSessionValue('usuario', resolvedEmail);
    this.persistSessionValue('email', resolvedEmail);

    const permissions = this.resolvePermissionsFromClaims(claims);
    if (permissions.length > 0) {
      sessionStorage.setItem('userPermissions', permissions.join(','));
    }
  }

  private resolvePermissionsFromClaims(claims: Record<string, unknown>): string[] {
    const adminPermissions = this.resolveAdminPermissions(claims);
    if (adminPermissions.length > 0) {
      return adminPermissions;
    }

    const discovered: string[] = [];

    const candidates = [
      claims['permissions'],
      claims['permisos'],
      claims['userPermissions'],
      claims['authorities'],
      claims['user-permissions'],
      claims['permissions'],
      claims['permisos']
    ];

    candidates.forEach((candidate) => this.collectPermissionCandidate(candidate, discovered));

    const normalized = this.normalizePermissionList(discovered);
    if (normalized.some((permission) => permission.toUpperCase() === 'TODOS')) {
      return ['TODOS'];
    }

    return normalized;
  }

  private resolveAdminPermissions(claims: Record<string, unknown>): string[] {
    const discovered: string[] = [];
    this.collectPermissionCandidate(claims['roles'], discovered);
    this.collectPermissionCandidate(claims['role'], discovered);
    const roles = this.normalizePermissionList(discovered).map((item) => item.toUpperCase());
    const isAdmin = roles.some((role) => role === 'ADMINISTRADOR' || role === 'SUPER_ADMIN');
    return isAdmin ? ['TODOS'] : [];
  }

  private collectPermissionCandidate(candidate: unknown, discovered: string[]): void {
    if (!candidate) {
      return;
    }

    if (Array.isArray(candidate)) {
      candidate.forEach((item) => this.collectPermissionItem(item, discovered));
      return;
    }

    if (typeof candidate === 'string') {
      candidate.split(',').forEach((item) => this.addPermissionValue(item, discovered));
    }
  }

  private collectPermissionItem(item: unknown, discovered: string[]): void {
    if (typeof item === 'string') {
      this.addPermissionValue(item, discovered);
      return;
    }

    if (item && typeof item === 'object') {
      const nested = item as Record<string, unknown>;
      const nestedPermissions = nested['permissions'] ?? nested['permisos'] ?? nested['name'] ?? nested['nombre'];
      this.addPermissionValue(nestedPermissions, discovered);
    }
  }

  private addPermissionValue(value: unknown, discovered: string[]): void {
    if (typeof value !== 'string') {
      return;
    }

    const normalized = value.trim();
    if (normalized) {
      discovered.push(normalized);
    }
  }

  private normalizePermissionList(values: string[]): string[] {
    return [...new Set(values.map((item) => String(item).trim()).filter(Boolean))];
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

    const keys = ['token', 'businessToken', 'keycloakAccessToken', 'keycloakRefreshToken', 'idbusiness', 'idDatosUsuario', 'usuario', 'email', 'isLogin', 'userPermissions'];
    keys.forEach((key) => sessionStorage.removeItem(key));
    keys.forEach((key) => localStorage.removeItem(key));
  }

  private setStorageValue(key: string, value: unknown): void {
    if (value === undefined || value === null || value === '') {
      return;
    }

    sessionStorage.setItem(key, String(value));
    localStorage.setItem(key, String(value));
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
    return this.getStore().dispatch(new AddUser(registerUser, queryParams)).pipe(
      map(() => this.getStore().selectSnapshot(UsuariosState.getUsuarios))
    );
  }

  private getStore(): Store {
    return this.injector.get(Store);
  }
}
