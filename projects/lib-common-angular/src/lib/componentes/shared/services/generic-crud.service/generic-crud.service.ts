import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, Inject, Optional } from "@angular/core";
import { Observable } from "rxjs";
import { PlantillaResponse } from "juliaositembackenexpress/dist/utils/PlantillaResponse";
import { LibConfigService } from "../../../../config/lib-config.service";
import { MetaDataService } from "../meta-data.service.ts/meta-data.service";
import { QueryParams } from "juliaositembackenexpress/src/utils/queryParams";

@Injectable({ providedIn: "root" })
export class GenericCrudHttpService<T> {
  protected basePathUrl: string;

  constructor(
    protected http: HttpClient,
    private config: LibConfigService,
    private meta: MetaDataService,
    @Inject('ENDPOINT_KEY') @Optional() private endpointKey?: string
  ) {
    this.basePathUrl = this.endpointKey
      ? this.config.get<string>(this.endpointKey) || "http://localhost:3000"
      : "http://localhost:3000";
  }

  // Construye headers a partir de un objeto
  private buildHeaders(headersObj: Record<string, any>): HttpHeaders {
    let headers = new HttpHeaders();
    Object.keys(headersObj).forEach(key => {
      if (headersObj[key] !== undefined && headersObj[key] !== null) {
        headers = headers.set(key, headersObj[key]);
      }
    });
    return headers;
  }

  all(queryParams?: Record<string, any>): Observable<PlantillaResponse<T>> {
    const metaParams = this.meta.get('listar');
/*     const headers = this.buildHeaders({ ...metaParams, ...queryParams });
 */    return this.http.get<PlantillaResponse<T>>(`${this.basePathUrl}/all`, /* { headers } */);
  }

  add(payload: T, topic: string, queryParams?: Record<string, any>): Observable<PlantillaResponse<T>> {
    const metaParams = this.meta.get('guardar');
    const headers = this.buildHeaders({ ...metaParams, ...queryParams });
    return this.http.post<PlantillaResponse<T>>(
      `${this.basePathUrl}/add`,
      payload,
      { headers }
    );
  }

 update(payload: T & { id: any }, queryParams?: QueryParams): Observable<PlantillaResponse<T>> {
  const topic = queryParams?.topic;
  const headers = topic ? this.buildHeaders({ topic }) : undefined;

  return this.http.put<PlantillaResponse<T>>(
    `${this.basePathUrl}/${payload.id}`,
    payload,
    { headers }
  );
}

  delete(id: string, queryParams?: Record<string, any>): Observable<PlantillaResponse<T>> {
    const metaParams = this.meta.get('eliminar');
    const headers = this.buildHeaders({ ...metaParams, ...queryParams });
    return this.http.delete<PlantillaResponse<T>>(
      `${this.basePathUrl}/${id}`,
      { headers }
    );
  }

  getMockData(): T[] {
    return [];
  }
}
