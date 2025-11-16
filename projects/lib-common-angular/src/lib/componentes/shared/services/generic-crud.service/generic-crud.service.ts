import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, Inject, Optional } from "@angular/core";
import { Observable } from "rxjs";
import { PlantillaResponse } from "juliaositembackenexpress/dist/utils/PlantillaResponse";
import { LibConfigService } from "../../../../config/lib-config.service";
import { MetaDataService } from "../meta-data.service.ts/meta-data.service";

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

  private buildParams(paramsObj: Record<string, any>): HttpParams {
    let params = new HttpParams();
    Object.keys(paramsObj).forEach(key => {
      if (paramsObj[key] !== undefined && paramsObj[key] !== null) {
        params = params.set(key, paramsObj[key]);
      }
    });
    return params;
  }

  all(queryParams?: Record<string, any>): Observable<PlantillaResponse<T>> {
    const metaParams = this.meta.get( 'listar');
    const params = this.buildParams({ ...metaParams, ...queryParams });
    return this.http.get<PlantillaResponse<T>>(`${this.basePathUrl}/all`, { params });
  }

  add(payload: T, topic: string, queryParams?: Record<string, any>): Observable<PlantillaResponse<T>> {
    const metaParams = this.meta.get( 'guardar');
    return this.http.post<PlantillaResponse<T>>(
      `${this.basePathUrl}/${topic}/add`,
      payload,
      { params: this.buildParams({ ...metaParams, ...queryParams }) }
    );
  }

  update(payload: T & { id: any },queryParams?: Record<string, any>): Observable<PlantillaResponse<T>> {
    const metaParams = this.meta.get( 'guardar');
    return this.http.put<PlantillaResponse<T>>(
      `${this.basePathUrl}/${payload.id}`,
      payload,
      { params: this.buildParams({ ...metaParams, ...queryParams }) }
    );
  }

  delete(id: string, queryParams?: Record<string, any>): Observable<PlantillaResponse<T>> {
    const metaParams = this.meta.get( 'eliminar');
    return this.http.delete<PlantillaResponse<T>>(
      `${this.basePathUrl}/${id}`,
      { params: this.buildParams({ ...metaParams, ...queryParams }) }
    );
  }

  getMockData(): T[] {
    return [];
  }
}
