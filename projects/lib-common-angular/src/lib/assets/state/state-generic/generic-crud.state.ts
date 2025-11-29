/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { StateContext, Selector, Action } from '@ngxs/store';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { GenericCrudHttpService } from '../../../componentes/shared/services/generic-crud.service/generic-crud.service';
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
