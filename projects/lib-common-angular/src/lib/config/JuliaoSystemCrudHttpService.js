"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JuliaoSystemCrudHttpService = void 0;
const http_1 = require("@angular/common/http");
const core_1 = require("@angular/core");
let JuliaoSystemCrudHttpService = class JuliaoSystemCrudHttpService {
    constructor(http) {
        this.basePathUrl = "";
        this.http = http;
    }
    /**
     * Agrega una nueva entidad
     * @param request Datos de la entidad a agregar
     * @param queryParams Parámetros de consulta estándar
     */
    add(request, queryParams) {
        const headers = this.buildHeaders(queryParams);
        return this.http.post(`${this.basePathUrl}/add`, request, { headers });
    }
    /**
     * Obtiene todas las entidades
     * @param queryParams Parámetros de consulta estándar
     * @param filters Filtros adicionales (opcional)
     */
    all(queryParams, filters) {
        const headers = this.buildHeaders(queryParams);
        let url = `${this.basePathUrl}/all`;
        if (filters && filters.size > 0) {
            const filterParams = Array.from(filters.entries())
                .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                .join('&');
            url += `?${filterParams}`;
        }
        return this.http.get(url, { headers });
    }
    /**
     * Actualiza una entidad existente
     * @param request Datos actualizados de la entidad
     * @param queryParams Parámetros de consulta estándar
     */
    update(request, queryParams) {
        const headers = this.buildHeaders(queryParams);
        return this.http.put(`${this.basePathUrl}/update`, request, { headers });
    }
    /**
     * Elimina una entidad
     * @param queryParams Parámetros de consulta estándar
     */
    delete(queryParams) {
        const headers = this.buildHeaders(queryParams);
        const url = `${this.basePathUrl}/delete?id=${queryParams.id}`;
        return this.http.delete(url, { headers });
    }
    /**
     * Método virtual para obtener datos mock
     * Debe ser implementado por las clases hijas que necesiten datos mock
     * @returns Array de datos mock o null si no está implementado
     */
    getMockData() {
        return null;
    }
    /**
     * Construye los headers HTTP a partir de los QueryParams
     * @param queryParams Parámetros de consulta
     * @private
     */
    buildHeaders(queryParams) {
        let headers = new http_1.HttpHeaders();
        if (queryParams.ip)
            headers = headers.append('ip', queryParams.ip);
        if (queryParams.dominio)
            headers = headers.append('dominio', queryParams.dominio);
        if (queryParams.usuario)
            headers = headers.append('usuario', queryParams.usuario);
        if (queryParams.idbusiness)
            headers = headers.append('idBusiness', queryParams.idbusiness.toString());
        if (queryParams.proceso)
            headers = headers.append('proceso', queryParams.proceso);
        if (queryParams.topic)
            headers = headers.append('topic', queryParams.topic);
        if (queryParams.token)
            headers = headers.append('Authorization', `Bearer ${queryParams.token}`);
        if (queryParams.id)
            headers = headers.append('id', queryParams.id.toString());
        return headers;
    }
};
exports.JuliaoSystemCrudHttpService = JuliaoSystemCrudHttpService;
exports.JuliaoSystemCrudHttpService = JuliaoSystemCrudHttpService = __decorate([
    (0, core_1.Injectable)({
        providedIn: 'root'
    }),
    __metadata("design:paramtypes", [http_1.HttpClient])
], JuliaoSystemCrudHttpService);
