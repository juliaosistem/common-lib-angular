import { Action, StateContext, State, Selector } from '@ngxs/store';
import { AuthResponseDTO, RegisterUserDTO } from '@juliaosistem/core-dtos';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { createGenericCrudActions } from './state-generic/generic-crud.actions';
import { HttpClient } from '@angular/common/http';
import { getLibraryInjector } from '../../utils/library-injector';
import { LibConfigService } from '../../config/lib-config.service';
import { GenericCrudActions, GenericCrudState, LazyGenericCrudHttpService } from './state-generic/generic-crud.state';
import { Login } from './usuarios.actions';
import { tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { GenericCrudHttpService } from '../../componentes/shared/services/generic-crud.service/generic-crud.service';

// Acciones CRUD para usuarios
const usuariosActions = createGenericCrudActions<RegisterUserDTO>('usuarios');
export const UsuariosActions = usuariosActions;

@State<PlantillaResponse<RegisterUserDTO>>({
  name: 'usuarios',
  defaults: {
    data: undefined,
    dataList: [],
    message: '',
    rta: false,
  },
})
@Injectable()
export class UsuariosState extends GenericCrudState<RegisterUserDTO, RegisterUserDTO> {
  constructor() {
    const service = new LazyGenericCrudHttpService<RegisterUserDTO>('baseUrlUsers') as unknown as GenericCrudHttpService<RegisterUserDTO>;
    super(service, UsuariosActions as unknown as GenericCrudActions<RegisterUserDTO>);
  }

  @Selector()
  static getUsuarios(state: PlantillaResponse<RegisterUserDTO>) {
    return state.dataList;
  }
  
  @Selector()
  static Login(state: PlantillaResponse<AuthResponseDTO>) {
    return state;
  }

  @Action(Login)
  login(ctx: StateContext<PlantillaResponse<AuthResponseDTO>>, action: Login) {
    try {
      const injector = getLibraryInjector();
      const http = injector.get(HttpClient);
      const config = injector.get(LibConfigService);
      const url = (config.get('baseUrlUsers') as string) + '/login';
      return http.post<PlantillaResponse<AuthResponseDTO>>(url, action.payload).pipe(
        tap((response) => {
          ctx.patchState({
            data: response.data,
            message: response.message,
            rta: response.rta,
          });
        })
      );
    } catch (e) {
      // Injector not ready or service missing
      console.error('Error in UsuariosState.login: ', e);
      return throwError(() => new Error('Library injector not initialized')) as unknown ;
    }
  }



}
