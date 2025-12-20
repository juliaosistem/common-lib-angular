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
import {
  GenericCrudActions,
  GenericCrudState,
} from './state-generic/generic-crud.state';
import { ProductService } from '../../componentes/shared/services/product.service';
import { createSelector } from '@ngxs/store';

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
    private meta: MetaDataService,
    private productSvc: ProductService
  ) {
  
    const service = new GenericCrudHttpService<ProductoDTO>(
      http,
      config,
      meta,
      'baseUrlProducts',
    );
    super(
      service,
      ProductosActions as unknown as GenericCrudActions<ProductoDTO>,
    );
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
    return this.service
      .all(action.payload)
      .pipe(tap((res) => ctx.setState(res)));
  }
@Action(ProductosActions.Add)
override add(ctx: StateContext<PlantillaResponse<ProductoDTO>>, action: any) {
  return this.service.add(action.payload, action.queryParams).pipe(
    tap((res) => {
      const state = ctx.getState();
      const newItem = res.data;
      if (newItem && state.dataList) {
        ctx.setState({
          ...state,
          dataList: [...state.dataList, newItem],
          data: newItem,
          message: res.message,
          rta: true,
        });
      }
    })
  );
}

@Action(ProductosActions.Update)
override update(ctx: StateContext<PlantillaResponse<ProductoDTO>>, action: any) {
  return this.service.update(action.payload, action.queryParams).pipe(
    tap((res) => {
      const state = ctx.getState();
      const updatedItem = res.data;
      if (updatedItem && state.dataList) {
        ctx.setState({
          ...state,
          dataList: state.dataList.map((item: any) =>
            item.id === updatedItem.id ? updatedItem : item
          ),
          data: updatedItem,
          message: res.message,
          rta: true,
        });
      }
    })
  );
}

@Action(ProductosActions.Delete)
override delete(ctx: StateContext<PlantillaResponse<ProductoDTO>>, action: any) {
  return this.service.delete(action.queryParams).pipe(
    tap((res) => {
      const state = ctx.getState();
      if (state.dataList) {
        ctx.setState({
          ...state,
          dataList: state.dataList.filter((item: any) => item.id !== action.id),
          message: res.message,
          rta: true,
        });
      }
    })
    );
  }
  @Action(ProductosActions.LoadMock)
override loadMock(ctx: StateContext<PlantillaResponse<ProductoDTO>>) {
    try {
      const mockData = this.productSvc.mockProductosInflablesDTO();
      ctx.patchState({
        data: undefined,
        dataList: mockData,
        message: mockData.length
          ? 'Datos mock cargados correctamente'
          : 'No hay datos mock disponibles',
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
