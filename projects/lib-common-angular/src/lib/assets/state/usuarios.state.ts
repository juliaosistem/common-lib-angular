import { Action, StateContext, State, Selector } from '@ngxs/store';
import { AuthResponseDTO, RegisterUserDTO } from '@juliaosistem/core-dtos';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { createGenericCrudActions } from './state-generic/generic-crud.actions';
import { HttpClient, HttpParams } from '@angular/common/http';
import { getLibraryInjector } from '../../utils/library-injector';
import { LibConfigService } from '../../config/lib-config.service';
import { GenericCrudActions, GenericCrudState, LazyGenericCrudHttpService } from './state-generic/generic-crud.state';
import { Login, RefreshToken } from './usuarios.actions';
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

  @Selector()
  static Session(state: PlantillaResponse<AuthResponseDTO>) {
    return state;
  }

  @Action(Login)
  login(ctx: StateContext<PlantillaResponse<AuthResponseDTO>>, action: Login) {
    try {
      const injector = getLibraryInjector();
      const http = injector.get(HttpClient);
      const config = injector.get(LibConfigService);
      const url = (config.get('baseUrlUsers') as string) + '/login';
      const idBussines = action.payload.idBussines ?? config.getAuthTenantId();
      return http.post<PlantillaResponse<AuthResponseDTO>>(url, { ...action.payload, idBussines }).pipe(
        tap((response) => this.patchAuthState(ctx, response))
      );
    } catch (e) {
      // Injector not ready or service missing
      console.error('Error in UsuariosState.login: ', e);
      return throwError(() => new Error('Library injector not initialized')) as unknown ;
    }
  }

  /**
   * Renueva la sesion contra /user/refresh-session y publica los nuevos tokens en el estado.
   *
   * @param ctx contexto NGXS del estado de usuarios
   * @param action accion con el refreshToken vigente
   * @returns observable con la respuesta estandar de renovacion
   */
  @Action(RefreshToken)
  refreshToken(ctx: StateContext<PlantillaResponse<AuthResponseDTO>>, action: RefreshToken) {
    try {
      const injector = getLibraryInjector();
      const http = injector.get(HttpClient);
      const config = injector.get(LibConfigService);
      const baseUrl = String(config.get('baseUrlUsers') ?? '').replace(/\/$/, '');
      const idBussines = config.getAuthTenantId();
      let form = new HttpParams().set('refresh_token', action.payload.refreshToken);
      if (idBussines !== undefined) form = form.set('idBussines', idBussines);
      return http.post<PlantillaResponse<AuthResponseDTO>>(`${baseUrl}/refresh-session`, form).pipe(
        tap((response) => this.patchAuthState(ctx, response))
      );
    } catch (e) {
      console.error('Error in UsuariosState.refreshToken: ', e);
      return throwError(() => new Error('Library injector not initialized')) as unknown;
    }
  }

  /** Publishes only the authentication response fields shared by login and renewal. */
  private patchAuthState(ctx: StateContext<PlantillaResponse<AuthResponseDTO>>, response: PlantillaResponse<AuthResponseDTO>): void {
    ctx.patchState({
      data: response.data,
      message: response.message,
      rta: response.rta,
      httpStatus: response.httpStatus,
    });
  }

}
