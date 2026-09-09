import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { BusinessDTO } from '@juliaosistem/core-dtos';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { createGenericCrudActions } from './state-generic/generic-crud.actions';
import { GenericCrudState, LazyGenericCrudHttpService } from './state-generic/generic-crud.state';
import { GenericCrudHttpService } from '../../componentes/shared/services/generic-crud.service/generic-crud.service';

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
  constructor() {
    const genericService = new LazyGenericCrudHttpService<BusinessDTO>('baseUrlBusiness') as unknown as GenericCrudHttpService<BusinessDTO>;
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
      console.log("desde state",error)
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
