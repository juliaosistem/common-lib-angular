import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { Observable } from 'rxjs';
import { LibConfigService } from '../config/lib-config.service';
import { MetaDataService } from './meta-data.service.ts/meta-data.service';
import { getSessionToken } from '../utils/business-token.util';

export interface RoleCrudDto {
	id?: string | number;
	idRol?: string | number;
	nameRol?: string;
	descripcion?: string;
	permisos?: string[];
}

type RolesProcess = 'listar' | 'guardar' | 'eliminar';
type RolesResponse = PlantillaResponse<RoleCrudDto>;

@Injectable({ providedIn: 'root' })
export class RolesService {
	constructor(
		private readonly http: HttpClient,
		@Inject(LibConfigService) private readonly configService: LibConfigService,
		@Inject(MetaDataService) private readonly metaDataService: MetaDataService,
	) {}

	/**
	 * Consulta la lista de roles o un rol puntual por id.
	 *
	 * @param id Identificador opcional del rol.
	 * @returns Observable con la respuesta estandar del backend.
	 */
	list(id?: string | number | null): Observable<RolesResponse> {
		const normalizedId = String(id ?? '').trim();
		const params = normalizedId ? new HttpParams().set('id', normalizedId) : undefined;
		return this.http.get<RolesResponse>(this.buildUrl('/all'), { headers: this.buildHeaders('listar'), params });
	}

	/**
	 * Crea un nuevo rol en el catalogo de seguridad.
	 *
	 * @param payload DTO con el nombre del rol.
	 * @returns Observable con la respuesta de creacion.
	 */
	create(payload: RoleCrudDto): Observable<RolesResponse> {
		return this.http.post<RolesResponse>(this.buildUrl('/add'), payload, { headers: this.buildHeaders('guardar') });
	}

	/**
	 * Actualiza un rol existente usando el id como query param.
	 *
	 * @param id Identificador del rol.
	 * @param payload DTO con los datos a persistir.
	 * @returns Observable con la respuesta de actualizacion.
	 */
	update(id: string, payload: RoleCrudDto): Observable<RolesResponse> {
		const params = new HttpParams().set('id', id);
		return this.http.put<RolesResponse>(this.buildUrl('/update'), payload, { headers: this.buildHeaders('guardar'), params });
	}

	/**
	 * Elimina un rol existente del catalogo.
	 *
	 * @param id Identificador del rol.
	 * @returns Observable con la respuesta de eliminacion.
	 */
	delete(id: string): Observable<RolesResponse> {
		const params = new HttpParams().set('id', id);
		return this.http.delete<RolesResponse>(this.buildUrl('/delete'), { headers: this.buildHeaders('eliminar'), params });
	}

	/**
	 * Resuelve la URL base del recurso de roles.
	 *
	 * @param path Ruta relativa del endpoint.
	 * @returns URL final normalizada.
	 */
	private buildUrl(path: string): string {
		const baseUrl = String(this.configService.get('baseUrlRoles') ?? '').replace(/\/$/, '');
		return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
	}

	/**
	 * Construye los headers de auditoria y contexto esperados por common-lib.
	 *
	 * @param process Tipo de operacion a reportar.
	 * @returns Headers listos para HttpClient.
	 */
	private buildHeaders(process: RolesProcess): HttpHeaders {
		const metadataHeaders = this.metaDataService.get('roles', process);
		const headers = this.toHeaders(metadataHeaders);
		return this.withAuthorization(headers);
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
	 * Serializa un objeto plano en headers HTTP.
	 *
	 * @param values Valores candidatos a enviarse como header.
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
}
