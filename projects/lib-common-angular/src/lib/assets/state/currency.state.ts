/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { ProductoDTO } from '@juliaosistem/core-dtos';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { createGenericCrudActions } from './state-generic/generic-crud.actions';
import { GenericCrudHttpService } from '../../componentes/shared/services/generic-crud.service/generic-crud.service';
import { HttpClient } from '@angular/common/http';
import { LibConfigService } from '../../config/lib-config.service';
import { MetaDataService } from '../../componentes/shared/services/meta-data.service.ts/meta-data.service';
import { tap } from 'rxjs';
import { GenericCrudActions, GenericCrudState } from './state-generic/generic-crud.state';
import { MonedaDTO } from '@juliaosistem/core-dtos';

// Crear acciones genéricas para ProductoDTO
const monedaActions = createGenericCrudActions<ProductoDTO>('moneda');
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
  constructor(
    private http: HttpClient,
    private config: LibConfigService,
    private meta: MetaDataService
  ) {
    const service = new GenericCrudHttpService<MonedaDTO>(
      http,
      config,
      meta,
      'baseUrlCurrency'
    );
    super(service, MonedaActions as unknown as GenericCrudActions<MonedaDTO>);
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
