import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { BusinessDTO } from '@juliaosistem/core-dtos';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { createGenericCrudActions } from './generic-crud.actions';
import { GenericCrudState } from './generic-crud.state';
import { GenericCrudHttpService } from '../../componentes/shared/services/generic-crud.service/generic-crud.service';
import { HttpClient } from '@angular/common/http';
import { LibConfigService } from '../../config/lib-config.service';
import { MetaDataService } from '../../componentes/shared/services/meta-data.service.ts/meta-data.service';

// 🔹 Crear acciones genéricas para Business
const businessActions = createGenericCrudActions<BusinessDTO>('Business');

@State<PlantillaResponse<BusinessDTO>>({
  name: 'business',
  defaults: {
    data: undefined,
    dataList: [],
    message: '',
    rta: false,
  },
})
@Injectable()
export class BusinessState extends GenericCrudState<BusinessDTO, BusinessDTO> {
  constructor(
    http: HttpClient,
    config: LibConfigService,
    meta: MetaDataService
  ) {
    const genericService = new GenericCrudHttpService<BusinessDTO>(
      http,
      config,
      meta,
      'baseUrlBusiness' // Key del endpoint en LibConfigService
    );
    super(genericService, businessActions);
  }

  // 🔹 Acción opcional para cargar datos mock específicos
  @Action(businessActions.LoadMock)
  loadMockBusiness(ctx: StateContext<PlantillaResponse<BusinessDTO>>) {
    try {
      const service = this.service as GenericCrudHttpService<BusinessDTO>;
      const mockData = service.getMockData?.() || [];
      ctx.patchState({
        data: undefined,
        dataList: mockData,
        message: mockData.length
          ? 'Business mock cargados correctamente'
          : 'No hay datos mock disponibles',
        rta: mockData.length > 0,
      });
    } catch (error) {
      ctx.patchState({
        data: undefined,
        dataList: [],
        message: 'Error al cargar datos mock',
        rta: false,
      });
    }
  }
}

// Exportar acciones para usar en componentes
export const BusinessActions = businessActions;
