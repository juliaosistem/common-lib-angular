import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { QueryParams } from 'juliaositembackenexpress/dist/utils/queryParams';
import { MetaDataService } from '../services/meta-data.service.ts/meta-data.service';

@Injectable({
  providedIn: 'root'
})
export class JuliaoSystemCrudHttpService<RES, RQ> {
    protected http: HttpClient;
    basePathUrl: string = "";
    private readonly metaDataService = inject(MetaDataService, { optional: true });

    constructor(http: HttpClient) {
        this.http = http;
    }

    /**
     * Agrega una nueva entidad
     * @param request Datos de la entidad a agregar
     * @param queryParams Parámetros de consulta estándar
     */
    add(
        request: RQ extends { id: string | number } ? RQ : RQ & { id: string | number },
        queryParams: QueryParams
    ): Observable<PlantillaResponse<RES>> {
        const headers = this.buildHeaders(queryParams);
        return this.http.post<PlantillaResponse<RES>>(
            `${this.basePathUrl}/add`, 
            request,
            { headers }
        );
    }

    /**
     * Obtiene todas las entidades
     * @param queryParams Parámetros de consulta estándar
     * @param filters Filtros adicionales (opcional)
     */
    all(
        queryParams: QueryParams,
        filters?: Map<string, string>
    ): Observable<PlantillaResponse<RES>> {
        const headers = this.buildHeaders(queryParams);
        let url = `${this.basePathUrl}/all`;
        
        if (filters && filters.size > 0) {
            const filterParams = Array.from(filters.entries())
                .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                .join('&');
            url += `?${filterParams}`;
        }

        return this.http.get<PlantillaResponse<RES>>(url, { headers });
    }

    /**
     * Actualiza una entidad existente
     * @param request Datos actualizados de la entidad
     * @param queryParams Parámetros de consulta estándar
     */
    update(
        request: RQ,
        queryParams: QueryParams
    ): Observable<PlantillaResponse<RES>> {
        const headers = this.buildHeaders(queryParams);
        return this.http.put<PlantillaResponse<RES>>(
            `${this.basePathUrl}/update`,
            request,
            { headers }
        );
    }

    /**
     * Elimina una entidad
     * @param queryParams Parámetros de consulta estándar
     */
    delete(
        queryParams: QueryParams
    ): Observable<PlantillaResponse<RES>> {
        const headers = this.buildHeaders(queryParams);
        const url = `${this.basePathUrl}/delete?id=${queryParams.id}`;
        return this.http.delete<PlantillaResponse<RES>>(url, { headers });
    }

    /**
     * Método virtual para obtener datos mock
     * Debe ser implementado por las clases hijas que necesiten datos mock
     * @returns Array de datos mock o null si no está implementado
     */
    getMockData?(): RES[] | null {
        return null;
    }

   

    /**
     * Construye los headers HTTP a partir de los QueryParams
     * @param queryParams Parámetros de consulta
     * @protected
     */
    protected buildHeaders(queryParams: QueryParams): HttpHeaders {
        const merged = this.mergeWithDefaults(queryParams);
        let headers = new HttpHeaders();
        
        if (merged.ip) headers = headers.append('ip', merged.ip);
        if (merged.dominio) headers = headers.append('dominio', merged.dominio);
        if (merged.usuario) headers = headers.append('usuario', merged.usuario);
        
        if (merged.idbusiness) {
            const value = merged.idbusiness.toString();
            headers = headers.append('idBusiness', value);
            headers = headers.append('idbusiness', value);
        }
    
        if (merged.proceso) headers = headers.append('proceso', merged.proceso);
        
        if (merged.topic) headers = headers.append('topic', merged.topic);

        if (merged.token) {
            headers = headers.append('token', merged.token);
            headers = headers.append('Authorization', `Bearer ${merged.token}`);
        }
        
        if (merged.id) headers = headers.append('id', merged.id.toString());
    
        return headers;
    }

    private mergeWithDefaults(queryParams: QueryParams): QueryParams {
        const meta = this.metaDataService;
        if (!meta) {
            return queryParams;
        }

        return {
            ...queryParams,
            ip: queryParams?.ip ?? meta.getIpFromSession(),
            dominio: queryParams?.dominio ?? meta.getDominioFromSession(),
            usuario: queryParams?.usuario ?? meta.getUsuarioFromSession(),
            idbusiness: queryParams?.idbusiness ?? meta.getIdBusinessFromSession(),
        } as QueryParams;
    }
}