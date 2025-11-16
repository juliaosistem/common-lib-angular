import { Injectable } from '@angular/core';
import { CategoriaDTO } from '@juliaosistem/core-dtos';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { createGenericCrudActions } from './generic-crud.actions';
import { GenericCrudState } from './generic-crud.state';
import { State, Action, StateContext } from '@ngxs/store';
import { GenericCrudHttpService } from '../../componentes/shared/services/generic-crud.service/generic-crud.service';
import { HttpClient } from '@angular/common/http';
import { LibConfigService } from '../../config/lib-config.service';
import { MetaDataService } from '../../componentes/shared/services/meta-data.service.ts/meta-data.service';

// 🔹 Crear acciones genéricas para Categorias
const categoriasActions = createGenericCrudActions<CategoriaDTO>('Categoria');

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
  constructor(
    http: HttpClient,
    config: LibConfigService,
    meta: MetaDataService
  ) {
    const genericService = new GenericCrudHttpService<CategoriaDTO>(
      http,
      config,
      meta,
      'baseUrlCategories' // Endpoint configurado en LibConfigService
    );
    super(genericService, categoriasActions);
  }

  //  Acción opcional para cargar datos mock específicos
  @Action(categoriasActions.LoadMock)
  loadMockCategorias(ctx: StateContext<PlantillaResponse<CategoriaDTO>>) {
    try {
      const service = this.service as GenericCrudHttpService<CategoriaDTO>;
      const mockData = service.getMockData?.() || [];
      ctx.patchState({
        data: undefined,
        dataList: mockData,
        message: mockData.length
          ? 'Categorías mock cargadas correctamente'
          : 'No hay categorías mock disponibles',
        rta: mockData.length > 0,
      });
    } catch (error) {
      ctx.patchState({
        data: undefined,
        dataList: [],
        message: 'Error al cargar categorías mock',
        rta: false,
      });
    }
  }
}

// Exportar acciones para usarlas en componentes
export const CategoriasActions = categoriasActions;
