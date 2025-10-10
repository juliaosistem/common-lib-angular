/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { StateContext, Selector, Action } from '@ngxs/store';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';

import { QueryParams } from 'juliaositembackenexpress/dist/utils/queryParams';
import { JuliaoSystemCrudHttpService } from '../../config/JuliaoSystemCrudHttpService';


export interface GenericCrudActions<RQ> {
  All: new (payload: QueryParams, filters?: Map<string, string>) => any;
  Add: new (payload: RQ, queryParams: QueryParams) => any;
  Update: new (payload: RQ, queryParams: QueryParams) => any;
  Delete: new ( queryParams: QueryParams) => any;
  LoadMock: new () => any;
}

/**
 * Clase genérica base híbrida:
 * - Define @Action genéricos que se enlazan dinámicamente con las acciones pasadas.
 * - El estado hijo NO necesita volver a declararlos.
 * @param RES Tipo de dato de respuesta (entidad)
 * @param RQ Tipo de dato de solicitud (entidad o DTO)
 * @param service Servicio HTTP  específico
 */
@Injectable()
export abstract class GenericCrudState<RES, RQ> {
  protected constructor(
    protected readonly service: JuliaoSystemCrudHttpService<RES, RQ>,
    protected readonly actions: GenericCrudActions<RQ>
  ) {}

  // 🔹 Selector común
  @Selector()
  static getResponse<RES>(state: PlantillaResponse<RES>): PlantillaResponse<RES> {
    return state;
  }

  // 🔹 Obtener todos
  @Action(function (this: GenericCrudState<RES, RQ>) { return this.actions.All; } as any)
  All({ setState }: StateContext<PlantillaResponse<RES>>, action: any) {
    return this.service.all(action.payload, action.filters).subscribe((res) => {
      setState(res);
    });
  }

  // 🔹 Agregar
  @Action(function (this: GenericCrudState<RES, RQ>) { return this.actions.Add; } as any)
  add({ getState, setState }: StateContext<PlantillaResponse<RES>>, action: any) {
    return this.service.add(action.payload, action.queryParams).subscribe((res) => {
      const currentState = getState();
      const newItem = res.data;

      if (newItem && currentState.dataList) {
        const updatedState: PlantillaResponse<RES> = {
          ...currentState,
          dataList: [...currentState.dataList, newItem],
          data: newItem,
          message: res.message,
          rta: true,
        };
        setState(updatedState);
      }
    });
  }

  // 🔹 Actualizar
  @Action(function (this: GenericCrudState<RES, RQ>) { return this.actions.Update; } as any)
  update({ getState, setState }: StateContext<PlantillaResponse<RES>>, action: any) {
    return this.service.update(action.payload, action.queryParams).subscribe((res) => {
      const currentState = getState();
      const updatedItem = res.data;

      if (updatedItem && currentState.dataList) {
        const updatedList = currentState.dataList.map((item: any) =>
          item.id === (updatedItem as any).id ? updatedItem : item
        );

        const updatedState: PlantillaResponse<RES> = {
          ...currentState,
          data: updatedItem,
          dataList: updatedList,
          message: res.message,
          rta: true,
        };
        setState(updatedState);
      }
    });
  }

  // 🔹 Eliminar
  @Action(function (this: GenericCrudState<RES, RQ>) { return this.actions.Delete; } as any)
  delete({ getState, setState }: StateContext<PlantillaResponse<RES>>, action: any) {
    return this.service.delete(action.queryParams).subscribe((res) => {
      const currentState = getState();

      if (currentState.dataList) {
        const filteredList = currentState.dataList.filter((item: any) => item.id !== action.id);

        const updatedState: PlantillaResponse<RES> = {
          ...currentState,
          dataList: filteredList,
          message: res.message,
          rta: true,
        };
        setState(updatedState);
      }
    });
  }

  // Nueva acción para cargar datos mock
  // eslint-disable-next-line max-lines-per-function
  @Action(function (this: GenericCrudState<RES, RQ>) { return this.actions.LoadMock; } as any)
  loadMock(ctx: StateContext<PlantillaResponse<RES>>) {
    try {
      const service = this.service as any;
      if (service.getMockData && typeof service.getMockData === 'function') {
        const mockData = service.getMockData();
        ctx.patchState({
          data: undefined,
          dataList: mockData,
          message: 'Datos mock cargados correctamente',
          rta: true,
        });
      } else {
        ctx.patchState({
          data: undefined,
          dataList: [],
          message: 'No hay datos mock disponibles',
          rta: false,
        });
      }
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
