import { Injectable } from '@angular/core';
import { ProductoDTO } from '@juliaosistem/core-dtos';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { createGenericCrudActions } from './generic-crud.actions';
import { GenericCrudState } from './generic-crud.state';
import { State, Action, StateContext } from '@ngxs/store';
import { ProductService } from '../../componentes/shared/services/product.service';

// Definimos acciones específicas para Productos
const productosActions = createGenericCrudActions<ProductoDTO>('ProductoDTO');

@State<PlantillaResponse<ProductoDTO>>({
  name: 'productos',
  defaults: {
    data: undefined,
    dataList: [],
    message: '',
    rta: false,
  },
})
@Injectable()
export class ProductosState extends GenericCrudState<ProductoDTO, ProductoDTO> {
  constructor(private productService: ProductService) {
  
    super(productService, productosActions);
  }

  // Acción específica para cargar datos mock - sobrescribe la genérica
  @Action(productosActions.LoadMock)
  loadMockProductos(ctx: StateContext<PlantillaResponse<ProductoDTO>>) {
    try {
      // Usar el método específico del ProductService
      const mockData = this.productService.mockProductosInflablesDTO();
      this.handleMockSuccess(ctx, mockData);
    } catch (error) {
      this.handleMockError(ctx, error);
    }
  }

  private handleMockSuccess(
    ctx: StateContext<PlantillaResponse<ProductoDTO>>, 
    mockData: ProductoDTO[]
  ) {
    ctx.patchState({
      data: undefined,
      dataList: mockData,
      message: 'Productos mock cargados correctamente',
      rta: true,
    });
  }

  private handleMockError(
    ctx: StateContext<PlantillaResponse<ProductoDTO>>, 
    error: unknown
  ) {
    ctx.patchState({
      data: undefined,
      dataList: [],
      message: 'Error al cargar productos mock' + error,
      rta: false,
    });
  }
}

// Exportar las acciones para usarlas en componentes
export const ProductosActions = productosActions;
