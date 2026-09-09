/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext, createSelector } from '@ngxs/store';
import { ProductoDTO } from '@juliaosistem/core-dtos';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { createGenericCrudActions } from './state-generic/generic-crud.actions';
import { GenericCrudHttpService } from '../../componentes/shared/services/generic-crud.service/generic-crud.service';
import { GenericCrudState, LazyGenericCrudHttpService } from './state-generic/generic-crud.state';
import { getLibraryInjector } from '../../utils/library-injector';
import { ProductService } from '../../componentes/shared/services/product.service';

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

  constructor() {
    const service = new LazyGenericCrudHttpService<ProductoDTO>('baseUrlProducts') as unknown as GenericCrudHttpService<ProductoDTO>;
    super(service, ProductosActions as any);
  }

  // Selector para lista de productos
  @Selector()
  static getProductos(state: PlantillaResponse<ProductoDTO>) {
    return state.dataList;
  }

  /**
   * Selector factory para obtener productos por id de categoría.
   * @param idCategoria 
   * @returns 
   */
  static selectByCategoriaId(idCategoria: string) {
    return createSelector([
      (state: { producto: PlantillaResponse<ProductoDTO> }) => state.producto
    ], (response: PlantillaResponse<ProductoDTO>) => {
      const list = (response?.dataList as ProductoDTO[]) || [];
      return list.filter(p => String(p.idCategoria) === String(idCategoria));
    });
  }

  // Acción All
  @Action(ProductosActions.All)
  all(ctx: StateContext<PlantillaResponse<ProductoDTO>>, action: any) {
   return this.All(ctx, action);
  }

  @Action(ProductosActions.Add)
  oadd(ctx: StateContext<PlantillaResponse<ProductoDTO>>, action: any) {
    return this.add(ctx, action);
  }


@Action(ProductosActions.Update)
  Update(ctx: StateContext<PlantillaResponse<ProductoDTO>>, action: any) {
  return this.update(ctx, action);
}



@Action(ProductosActions.Delete)
 Delete(ctx: StateContext<PlantillaResponse<ProductoDTO>>, action: any) {
  return this.delete(ctx, action);
  }

  @Action(ProductosActions.LoadMock)
override loadMock(ctx: StateContext<PlantillaResponse<ProductoDTO>>) {
    let mockData: ProductoDTO[] = [];
    try {
      const injector = getLibraryInjector();
      const productSvc = injector.get(ProductService) as ProductService;
      mockData = productSvc.mockProductosInflablesDTO();
    } catch {
      mockData = [];
    }
    ctx.patchState({
      data: undefined,
      dataList: mockData,
      message: mockData.length
        ? 'Datos mock cargados correctamente'
        : 'No hay datos mock disponibles',
      rta: !!mockData.length,
    });
  }

  
}
