/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { createGenericCrudActions } from './state-generic/generic-crud.actions';
import { tap } from 'rxjs';
import { GenericCrudState, LazyGenericCrudHttpService } from './state-generic/generic-crud.state';
import { MonedaDTO } from '@juliaosistem/core-dtos';
import { GenericCrudHttpService } from '../../componentes/shared/services/generic-crud.service/generic-crud.service';

// Crear acciones genéricas para MonedaDTO
const monedaActions = createGenericCrudActions<MonedaDTO>('moneda');
export const MonedaActions = monedaActions;

@State<PlantillaResponse<MonedaDTO>>({
  name: 'moneda',
  defaults: {
    data: undefined,
    dataList: [],
    message: '',
    rta: false,
  },
})
@Injectable()
export class MonedaState extends GenericCrudState<MonedaDTO, MonedaDTO> {
  constructor() {
    const service = new LazyGenericCrudHttpService<MonedaDTO>('baseUrlCurrency') as unknown as GenericCrudHttpService<MonedaDTO>;
    super(service, MonedaActions as any);
  }

  @Selector()
  static getProductos(state: PlantillaResponse<MonedaDTO>) {
    return state.dataList;
  }

  @Action(MonedaActions.All)
  all(ctx: StateContext<PlantillaResponse<MonedaDTO>>, action: any) {
    return this.service.all(action.payload).pipe(
      tap(res => ctx.setState(res))
    );
  }
}
