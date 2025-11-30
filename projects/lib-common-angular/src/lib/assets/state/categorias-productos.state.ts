/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { CategoriaDTO } from '@juliaosistem/core-dtos';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { createGenericCrudActions } from './state-generic/generic-crud.actions';
import { GenericCrudHttpService } from '../../componentes/shared/services/generic-crud.service/generic-crud.service';
import { HttpClient } from '@angular/common/http';
import { LibConfigService } from '../../config/lib-config.service';
import { MetaDataService } from '../../componentes/shared/services/meta-data.service.ts/meta-data.service';
import { tap } from 'rxjs';
import { GenericCrudActions, GenericCrudState } from './state-generic/generic-crud.state';


// Crear acciones genéricas para ProductoDTO
const categoriaproductoActions = createGenericCrudActions<CategoriaDTO>('categoriaproducto');
export const CategoriaproductoActions = categoriaproductoActions;

@State<PlantillaResponse<CategoriaDTO>>({
  name: 'categoriaproducto',
  defaults: {
    data: undefined,
    dataList: [],
    message: '',
    rta: false,
  },
})
@Injectable()
export class CategoriaProductoState extends GenericCrudState<CategoriaDTO, CategoriaDTO> {
  constructor(
    private http: HttpClient,
    private config: LibConfigService,
    private meta: MetaDataService
  ) {
    const service = new GenericCrudHttpService<CategoriaDTO>(
      http,
      config,
      meta,
      'baseUrlCategoryProduct'
    );
    super(service, CategoriaproductoActions as unknown as GenericCrudActions<CategoriaDTO>);
  }

  @Selector()
  static getProductos(state: PlantillaResponse<CategoriaDTO>) {
    return state.dataList;
  }

  @Action(CategoriaproductoActions.All)
  all(ctx: StateContext<PlantillaResponse<CategoriaDTO>>, action: any) {
    return this.service.all(action.payload).pipe(
      tap(res => ctx.setState(res))
    );
  }
}