import { HttpClient } from '@angular/common/http';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { QueryParams } from 'juliaositembackenexpress/dist/utils/queryParams';
import { Observable } from 'rxjs';
export declare class JuliaoSystemCrudHttpService<RES, RQ> {
    protected http: HttpClient;
    basePathUrl: string;
    constructor(http: HttpClient);
    /**
     * Agrega una nueva entidad
     * @param request Datos de la entidad a agregar
     * @param queryParams Parámetros de consulta estándar
     */
    add(request: RQ extends {
        id: string | number;
    } ? RQ : RQ & {
        id: string | number;
    }, queryParams: QueryParams): Observable<PlantillaResponse<RES>>;
    /**
     * Obtiene todas las entidades
     * @param queryParams Parámetros de consulta estándar
     * @param filters Filtros adicionales (opcional)
     */
    all(queryParams: QueryParams, filters?: Map<string, string>): Observable<PlantillaResponse<RES>>;
    /**
     * Actualiza una entidad existente
     * @param request Datos actualizados de la entidad
     * @param queryParams Parámetros de consulta estándar
     */
    update(request: RQ, queryParams: QueryParams): Observable<PlantillaResponse<RES>>;
    /**
     * Elimina una entidad
     * @param queryParams Parámetros de consulta estándar
     */
    delete(queryParams: QueryParams): Observable<PlantillaResponse<RES>>;
    /**
     * Método virtual para obtener datos mock
     * Debe ser implementado por las clases hijas que necesiten datos mock
     * @returns Array de datos mock o null si no está implementado
     */
    getMockData?(): RES[] | null;
    /**
     * Construye los headers HTTP a partir de los QueryParams
     * @param queryParams Parámetros de consulta
     * @private
     */
    private buildHeaders;
}
