import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { RegisterUserDTO } from '@juliaosistem/core-dtos';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { Observable } from 'rxjs';
import { RoleFilter } from './users-dashboard.models';
import { LibConfigService } from '../../../config/lib-config.service';
import { MetaDataService } from '../../../services/meta-data.service.ts/meta-data.service';
import { UserProfileSavePayload } from '../../../componentes/shared/molecules/user-profile-dialog1/user-profile-dialog1.component';
import { getSessionToken } from '../../../utils/business-token.util';

type UsersDashboardResponse = PlantillaResponse<Record<string, unknown>>;
type UsersDashboardProcess = 'listar' | 'guardar' | 'eliminar';

@Injectable({ providedIn: 'root' })
export class UsersDashboardApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(LibConfigService) private readonly configService: LibConfigService,
    @Inject(MetaDataService) private readonly metaDataService: MetaDataService,
  ) {}

  /**
   * Obtiene usuarios filtrados por nombre real de rol (EMPLEADO o USUARIO)
   * usando `/user/all-by-role`, o todos los usuarios del negocio con `/user/all`
   * cuando no se envia filtro de rol.
   *
   * @param roleFilter Nombre de rol esperado por el backend o null para todos.
   * @returns Observable con la respuesta estandarizada.
   */
  list(roleFilter: RoleFilter | null): Observable<UsersDashboardResponse> {
    if (!roleFilter) {
      return this.http.get<UsersDashboardResponse>(this.buildUrl('/all'), this.buildRequestOptions('listar'));
    }
    return this.http.get<UsersDashboardResponse>(this.buildUrl('/all-by-role'), this.buildRequestOptions('listar', { role: roleFilter }));
  }

  /**
   * Crea un usuario nuevo.
   *
   * @param payload DTO de registro.
   * @returns Observable con la respuesta del backend.
   */
  add(payload: RegisterUserDTO): Observable<UsersDashboardResponse> {
    return this.http.post<UsersDashboardResponse>(this.buildUrl('/add'), payload, this.buildRequestOptions('guardar'));
  }

  /**
   * Actualiza el perfil de negocio del usuario.
   *
   * @param userId Identificador del usuario.
   * @param payload Payload completo emitido por el dialogo reusable.
   * @returns Observable con la respuesta del backend.
   */
  updateProfile(userId: string, payload: UserProfileSavePayload): Observable<UsersDashboardResponse> {
    return this.http.put<UsersDashboardResponse>(this.buildUrl('/update-profile'), payload.updateProfileDTO, this.buildRequestOptions('guardar', { userId }));
  }

  /**
   * Elimina un usuario.
   *
   * @param userId Identificador del usuario.
   * @returns Observable con la respuesta del backend.
   */
  delete(userId: string): Observable<UsersDashboardResponse> {
    return this.http.delete<UsersDashboardResponse>(this.buildUrl(`/delete/${encodeURIComponent(userId)}`), this.buildRequestOptions('eliminar'));
  }

  /**
   * Construye la URL base del microservicio.
   *
   * @param path Ruta relativa.
   * @returns URL final normalizada.
   */
  private buildUrl(path: string): string {
    const baseUrl = String(this.configService.get('baseUrlUsers') ?? '').replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}`;
  }

  /**
   * Construye headers y query params con metadatos de sesion.
   *
   * @param topic Tema de trazabilidad.
   * @param queryParams Parametros extra para la llamada.
   * @returns Opciones listas para HttpClient.
   */
  private buildRequestOptions(topic: UsersDashboardProcess, queryParams?: Record<string, string | number | boolean>): { headers: HttpHeaders; params?: HttpParams } {
    const headers = this.withAuthorization(this.toHeaders(this.metaDataService.get('usuarios', topic)));
    const params = queryParams ? this.toParams(queryParams) : undefined;
    return params ? { headers, params } : { headers };
  }

  /**
   * Agrega el header Authorization usando businessToken o fallback de sesion.
   *
   * @param headers Headers base con metadatos.
   * @returns Headers con bearer token cuando existe sesion.
   */
  private withAuthorization(headers: HttpHeaders): HttpHeaders {
    const sessionToken = this.resolveSessionToken();
    if (!sessionToken) {
      return headers;
    }
    return headers.set('Authorization', `Bearer ${sessionToken}`);
  }

  /**
   * Resuelve token de sesion priorizando businessToken y fallbacks conocidos.
   *
   * @returns Token listo para header Authorization o cadena vacia.
   */
  private resolveSessionToken(): string {
    const token = getSessionToken()
      || sessionStorage.getItem('keycloakAccessToken')
      || localStorage.getItem('keycloakAccessToken')
      || '';
    return String(token).trim();
  }

  /**
   * Serializa un objeto en headers HTTP.
   *
   * @param values Valores a convertir.
   * @returns Instancia de HttpHeaders.
   */
  private toHeaders(values: Record<string, unknown>): HttpHeaders {
    let headers = new HttpHeaders();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        headers = headers.set(key, String(value));
      }
    });
    return headers;
  }

  /**
   * Serializa un objeto en query params HTTP.
   *
   * @param values Valores a convertir.
   * @returns Instancia de HttpParams.
   */
  private toParams(values: Record<string, string | number | boolean>): HttpParams {
    let params = new HttpParams();
    Object.entries(values).forEach(([key, value]) => {
      params = params.set(key, String(value));
    });
    return params;
  }
}
