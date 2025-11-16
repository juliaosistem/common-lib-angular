import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlantillaResponse } from 'juliaositembackenexpress/src/utils/PlantillaResponse';
import { QueryParams } from 'juliaositembackenexpress/src/utils/queryParams';

@Injectable({
  providedIn: 'root'
})
export class JuliaoSystemCrudHttpService<RES, RQ> {
    protected http: HttpClient;
    basePathUrl: string = "";

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
     * @private
     */
    private buildHeaders(queryParams: QueryParams): HttpHeaders {
        let headers = new HttpHeaders();
        
        if (queryParams.ip)   headers = headers.append('ip', queryParams.ip);
        if (queryParams.dominio) headers = headers.append('dominio', queryParams.dominio) ;
        if (queryParams.usuario)   headers = headers.append('usuario', queryParams.usuario);
        
        if (queryParams.idbusiness) headers = headers.append('idBusiness', queryParams.idbusiness.toString());
    
        if (queryParams.proceso) headers = headers.append('proceso', queryParams.proceso);
        
        if (queryParams.topic) headers = headers.append('topic', queryParams.topic);

        if (queryParams.token) headers = headers.append('Authorization', `Bearer ${queryParams.token}`);
        
        if (queryParams.id)    headers = headers.append('id', queryParams.id.toString());
    
        return headers;
    }
}