/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { TipoCategoriaDTO } from '@juliaosistem/core-dtos';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { createGenericCrudActions } from './state-generic/generic-crud.actions';
import { tap } from 'rxjs';
import { GenericCrudState, LazyGenericCrudHttpService } from './state-generic/generic-crud.state';
import { GenericCrudHttpService } from '../../componentes/shared/services/generic-crud.service/generic-crud.service';

const tipoCategoriaActions = createGenericCrudActions<TipoCategoriaDTO>('tipocategoria');
export const TipoCategoriaActions = tipoCategoriaActions;

@State<PlantillaResponse<TipoCategoriaDTO>>({
  name: 'tipocategoria',
  defaults: {
    data: undefined,
    dataList: [],
    message: '',
    rta: false,
  },
})
@Injectable()
export class TipoCategoriaState extends GenericCrudState<TipoCategoriaDTO, TipoCategoriaDTO> {

  constructor() {
    const service = new LazyGenericCrudHttpService<TipoCategoriaDTO>('baseUrlTipoCategoria') as unknown as GenericCrudHttpService<TipoCategoriaDTO>;
    super(service, TipoCategoriaActions as any);
  }

  @Selector()
  static getTipoCategorias(state: PlantillaResponse<TipoCategoriaDTO>) {
    return state.dataList;
  }

  @Action(TipoCategoriaActions.All)
  all(ctx: StateContext<PlantillaResponse<TipoCategoriaDTO>>, action: any) {
    return this.service.all(action.payload).pipe(
      tap(res => ctx.setState(res))
    );
  }

  @Action(TipoCategoriaActions.Add)
  oadd(ctx: StateContext<PlantillaResponse<TipoCategoriaDTO>>, action: any) {
    return this.add(ctx, action);
  }
}
