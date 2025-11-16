/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { ProductoDTO } from '@juliaosistem/core-dtos';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { createGenericCrudActions } from './generic-crud.actions';
import { GenericCrudHttpService } from '../../componentes/shared/services/generic-crud.service/generic-crud.service';
import { HttpClient } from '@angular/common/http';
import { LibConfigService } from '../../config/lib-config.service';
import { MetaDataService } from '../../componentes/shared/services/meta-data.service.ts/meta-data.service';
import { tap } from 'rxjs';
import { GenericCrudActions, GenericCrudState } from './generic-crud.state';

// Crear acciones genéricas para ProductoDTO
const productosActions = createGenericCrudActions<ProductoDTO>('producto');
export const ProductosActions = productosActions;

@State<PlantillaResponse<ProductoDTO>>({
  name: 'producto',
  defaults: {
    data: undefined,
    dataList: [],
    message: '',
    rta: false,
  },
})
@Injectable()
export class ProductosState extends GenericCrudState<ProductoDTO, ProductoDTO> {
  constructor(
    private http: HttpClient,
    private config: LibConfigService,
    private meta: MetaDataService
  ) {
    const service = new GenericCrudHttpService<ProductoDTO>(
      http,
      config,
      meta,
      'baseUrlProducts'
    );
    super(service, ProductosActions as unknown as GenericCrudActions<ProductoDTO>);
  }

  @Selector()
  static getProductos(state: PlantillaResponse<ProductoDTO>) {
    return state.dataList;
  }

  @Action(ProductosActions.All)
  all(ctx: StateContext<PlantillaResponse<ProductoDTO>>, action: any) {
    return this.service.all(action.payload).pipe(
      tap(res => ctx.setState(res))
    );
  }
}
