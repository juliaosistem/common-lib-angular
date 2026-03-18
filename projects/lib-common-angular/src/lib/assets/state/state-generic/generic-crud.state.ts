/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { StateContext, Selector, Action, createSelector } from '@ngxs/store';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { GenericCrudHttpService } from '../../../componentes/shared/services/generic-crud.service/generic-crud.service';
import { HttpClient } from '@angular/common/http';
import { LibConfigService } from '../../../config/lib-config.service';
import { MetaDataService } from '../../../componentes/shared/services/meta-data.service.ts/meta-data.service';
import { getLibraryInjector } from '../../../utils/library-injector';

/**
 * Lazy wrapper for GenericCrudHttpService that defers obtaining the real
 * GenericCrudHttpService until the library injector is available. This
 * prevents calling `getLibraryInjector()` during state construction which
 * can run before the host app registers the global injector.
 */
export class LazyGenericCrudHttpService<RES> {
  private realService: GenericCrudHttpService<RES> | null = null;

  constructor(private readonly baseUrlKey: string) {}

  private ensureReal(): void {
    if (!this.realService) {
      const injector = getLibraryInjector();
      const http = injector.get(HttpClient);
      const config = injector.get(LibConfigService);
      const meta = injector.get(MetaDataService);
      this.realService = new GenericCrudHttpService<RES>(http, config, meta, this.baseUrlKey);
    }
  }

  all(payload: any) {
    this.ensureReal();
    return this.realService!.all(payload);
  }

  add(payload: any, queryParams: any) {
    this.ensureReal();
    return this.realService!.add(payload, queryParams);
  }

  update(payload: any, queryParams: any) {
    this.ensureReal();
    return this.realService!.update(payload, queryParams);
  }

  delete(queryParams: any) {
    this.ensureReal();
    return this.realService!.delete(queryParams);
  }

  getMockData?() {
    this.ensureReal();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.realService as any).getMockData?.();
  }
}
import { tap } from 'rxjs';

export interface GenericCrudActions<RQ> {
  All: new (payload: any, filters?: Map<string, string>) => any;
  Add: new (payload: RQ, queryParams: any) => any;
  Update: new (payload: RQ, queryParams: any) => any;
  Delete: new (queryParams: any) => any;
  LoadMock: new () => any;
}

@Injectable()
export abstract class GenericCrudState<RES, RQ> {
  protected constructor(
    protected readonly service: GenericCrudHttpService<RES>,
    protected readonly actions: GenericCrudActions<RQ>
  ) {}

  @Selector()
  static getResponse<RES>(state: PlantillaResponse<RES>): PlantillaResponse<RES> {
    return state;
  }

  /**
   * Selector factory para obtener un elemento por id desde el estado genérico.
   * Uso: store.selectSnapshot(YourState.selectById(id))
   */
  static selectById<RES>(id: string | number) {
    return createSelector([
      // Reutiliza el selector base que expone el response del estado
      (this as unknown as typeof GenericCrudState).getResponse as (state: PlantillaResponse<RES>) => PlantillaResponse<RES>
    ], (response: PlantillaResponse<RES>) => {
      const list = (response?.dataList as unknown as Array<{ id?: string | number }> | undefined) ?? [];
      return list.find((item) => String(item?.id ?? '') === String(id)) as unknown as RES | undefined;
    });
  }

  @Action(function (this: GenericCrudState<RES, RQ>) { return this.actions.All; } as any)
  All({ setState }: StateContext<PlantillaResponse<RES>>, action: any) {
    return this.service.all(action.payload).pipe(
      tap(res => setState(res))
    );
  }

 @Action(function (this: GenericCrudState<RES, RQ>) { return this.actions.Add; } as any)
add(ctx: StateContext<PlantillaResponse<RES>>, action: any) {
  return this.service.add(action.payload, action.queryParams);
}

@Action(function (this: GenericCrudState<RES, RQ>) { return this.actions.Update; } as any)
update(ctx: StateContext<PlantillaResponse<RES>>, action: any) {
  return this.service.update(action.payload, action.queryParams);
}

@Action(function (this: GenericCrudState<RES, RQ>) { return this.actions.Delete; } as any)
delete(ctx: StateContext<PlantillaResponse<RES>>, action: any) {
  return this.service.delete(action.queryParams);
}

  @Action(function (this: GenericCrudState<RES, RQ>) { return this.actions.LoadMock; } as any)
  loadMock(ctx: StateContext<PlantillaResponse<RES>>) {
    try {
      const mockData = (this.service as any).getMockData?.() ?? [];
      ctx.patchState({
        data: undefined,
        dataList: mockData,
        message: mockData.length ? 'Datos mock cargados correctamente' : 'No hay datos mock disponibles',
        rta: !!mockData.length,
      });
    } catch (error) {
      ctx.patchState({
        data: undefined,
        dataList: [],
        message: 'Error al cargar datos mock ' + error,
        rta: false,
      });
    }
  }
}
