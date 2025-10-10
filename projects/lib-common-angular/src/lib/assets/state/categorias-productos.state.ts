import { Injectable } from '@angular/core';
import { CategoriaDTO } from '@juliaosistem/core-dtos';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { createGenericCrudActions } from './generic-crud.actions';
import { GenericCrudState } from './generic-crud.state';
import { State, Action, StateContext } from '@ngxs/store';
import { CategoriasProductosService } from '../../componentes/shared/services/categorias-productos.service';

// Definimos acciones específicas para Categorias
const categoriasActions = createGenericCrudActions<CategoriaDTO>('CategoriaDTO');

@State<PlantillaResponse<CategoriaDTO>>({
  name: 'categoriasProductos',
  defaults: {
    data: undefined,
    dataList: [],
    message: '',
    rta: false,
  },
})
@Injectable()
export class CategoriasProductosState extends GenericCrudState<CategoriaDTO, CategoriaDTO> {
  constructor(service: CategoriasProductosService) {
    super(service, categoriasActions);
  }

  // Acción específica para cargar datos mock
  @Action(categoriasActions.LoadMock)
  loadMockCategorias(ctx: StateContext<PlantillaResponse<CategoriaDTO>>) {
    try {
      const service = this.service as CategoriasProductosService;
      service.getCategoriasMock().subscribe({
        next: (mockData) => this.handleMockSuccess(ctx, mockData),
        error: (error) => this.handleMockError(ctx, error)
      });
    } catch (error) {
      this.handleMockError(ctx, error);
    }
  }

  private handleMockSuccess(
    ctx: StateContext<PlantillaResponse<CategoriaDTO>>, 
    mockData: CategoriaDTO[]
  ) {
    ctx.patchState({
      data: undefined,
      dataList: mockData,
      message: 'Categorías mock cargadas correctamente',
      rta: true,
    });
  }

  private handleMockError(
    ctx: StateContext<PlantillaResponse<CategoriaDTO>>, 
    error: unknown
  ) {
    console.error('Error cargando categorías mock:', error);
    ctx.patchState({
      data: undefined,
      dataList: [],
      message: 'Error al cargar categorías mock',
      rta: false,
    });
  }
}

// Exportar las acciones para usarlas en componentes
export const CategoriasActions = categoriasActions;
