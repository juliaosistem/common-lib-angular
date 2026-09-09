import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { Observable } from 'rxjs';
import { LibConfigService } from '../config/lib-config.service';
import { MetaDataService } from './meta-data.service.ts/meta-data.service';
import { getSessionToken } from '../utils/business-token.util';

export interface PermisoCrudDto {
	idPermiso?: string;
	nombrePermiso?: string;
	descripcion?: string;
}

type PermisosProcess = 'listar' | 'guardar' | 'eliminar';
type PermisosResponse = PlantillaResponse<PermisoCrudDto>;

/**
 * Servicio HTTP reutilizable para el catalogo dinamico de permisos (`/permisos`).
 * Replica el mismo patron de headers y autorizacion usado por RolesService.
 */
@Injectable({ providedIn: 'root' })
export class PermisosService {
	constructor(
		private readonly http: HttpClient,
		@Inject(LibConfigService) private readonly configService: LibConfigService,
		@Inject(MetaDataService) private readonly metaDataService: MetaDataService,
	) {}

	/**
	 * Consulta el catalogo de permisos o un permiso puntual por id.
	 *
	 * @param id Identificador opcional del permiso.
	 * @returns Observable con la respuesta estandar del backend.
	 */
	list(id?: string | null): Observable<PermisosResponse> {
		const normalizedId = String(id ?? '').trim();
		const params = normalizedId ? new HttpParams().set('id', normalizedId) : undefined;
		return this.http.get<PermisosResponse>(this.buildUrl('/all'), { headers: this.buildHeaders('listar'), params });
	}

	/**
	 * Crea un nuevo permiso dinamico.
	 *
	 * @param payload DTO con nombre y descripcion del permiso.
	 * @returns Observable con la respuesta de creacion.
	 */
	create(payload: PermisoCrudDto): Observable<PermisosResponse> {
		return this.http.post<PermisosResponse>(this.buildUrl('/add'), payload, { headers: this.buildHeaders('guardar') });
	}

	/**
	 * Actualiza un permiso existente usando el id como query param.
	 *
	 * @param id Identificador del permiso.
	 * @param payload DTO con los datos a persistir.
	 * @returns Observable con la respuesta de actualizacion.
	 */
	update(id: string, payload: PermisoCrudDto): Observable<PermisosResponse> {
		const params = new HttpParams().set('id', id);
		return this.http.put<PermisosResponse>(this.buildUrl('/update'), payload, { headers: this.buildHeaders('guardar'), params });
	}

	/**
	 * Elimina un permiso existente del catalogo.
	 *
	 * @param id Identificador del permiso.
	 * @returns Observable con la respuesta de eliminacion.
	 */
	delete(id: string): Observable<PermisosResponse> {
		const params = new HttpParams().set('id', id);
		return this.http.delete<PermisosResponse>(this.buildUrl('/delete'), { headers: this.buildHeaders('eliminar'), params });
	}

	/**
	 * Resuelve la URL base del recurso de permisos.
	 *
	 * @param path Ruta relativa del endpoint.
	 * @returns URL final normalizada.
	 */
	private buildUrl(path: string): string {
		const baseUrl = String(this.configService.get('baseUrlPermisos') ?? '').replace(/\/$/, '');
		return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
	}

	/**
	 * Construye los headers de auditoria y contexto esperados por common-lib.
	 *
	 * @param process Tipo de operacion a reportar.
	 * @returns Headers listos para HttpClient.
	 */
	private buildHeaders(process: PermisosProcess): HttpHeaders {
		const metadataHeaders = this.metaDataService.get('permisos', process);
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
