/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { CategoriaDTO } from '@juliaosistem/core-dtos';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { createGenericCrudActions } from './state-generic/generic-crud.actions';
import { tap } from 'rxjs';
import { GenericCrudState, LazyGenericCrudHttpService } from './state-generic/generic-crud.state';
import { ProductService } from '../../componentes/shared/services/product.service';
import { GenericCrudHttpService } from '../../componentes/shared/services/generic-crud.service/generic-crud.service';
import { getLibraryInjector } from '../../utils/library-injector';


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

  constructor() {
    const service = new LazyGenericCrudHttpService<CategoriaDTO>('baseUrlCategoryProduct') as unknown as GenericCrudHttpService<CategoriaDTO>;
    super(service, CategoriaproductoActions as any);
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
  @Action(CategoriaproductoActions.LoadMock)
  override loadMock(ctx: StateContext<PlantillaResponse<CategoriaDTO>>) {
    let mockData: CategoriaDTO[] = [];
    try {
      const injector = getLibraryInjector();
      const productSvc = injector.get(ProductService) as ProductService;
      mockData = productSvc.mockCategoriaInflablesDTO();
    } catch {
      mockData = [];
    }
    ctx.patchState({
      data: undefined,
      dataList: mockData,
      message: mockData.length ? 'Datos mock cargados correctamente' : 'No hay datos mock disponibles',
      rta: !!mockData.length,
    });
  }

  @Action(CategoriaproductoActions.Add)
  oadd(ctx: StateContext<PlantillaResponse<CategoriaDTO>>, action: any) {
    return this.add(ctx, action);
  }
}