import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, finalize, of, tap } from 'rxjs';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { DeleteUsersDashboard, LoadUsersDashboard, SaveUsersDashboardProfile } from './users-dashboard.actions';
import { RoleFilter, UserSection, UsersDashboardStateModel } from './users-dashboard.models';
import { UsersDashboardApiService } from './users-dashboard-api.service';

interface UserUpsertResult {
  section: UserSection;
  userId: string | null;
  item: Record<string, unknown> | undefined;
  response: PlantillaResponse<Record<string, unknown>>;
}

const initialState: UsersDashboardStateModel = {
  data: undefined,
  dataList: [],
  message: '',
  rta: false,
  httpStatus: undefined,
  employees: [],
  clients: [],
  all: [],
  loading: false,
  error: '',
};

@State<UsersDashboardStateModel>({
  name: 'usersDashboard',
  defaults: initialState,
})
@Injectable()
export class UsersDashboardState {
  constructor(private readonly api: UsersDashboardApiService) {}

  /**
   * Obtiene los empleados cacheados.
   *
   * @param state Estado completo.
   * @returns Lista de empleados.
   */
  @Selector()
  static getEmployees(state: UsersDashboardStateModel): Record<string, unknown>[] {
    return state.employees;
  }

  /**
   * Obtiene los clientes cacheados.
   *
   * @param state Estado completo.
   * @returns Lista de clientes.
   */
  @Selector()
  static getClients(state: UsersDashboardStateModel): Record<string, unknown>[] {
    return state.clients;
  }

  /**
   * Obtiene todos los usuarios del negocio cacheados.
   *
   * @param state Estado completo.
   * @returns Lista completa de usuarios.
   */
  @Selector()
  static getAll(state: UsersDashboardStateModel): Record<string, unknown>[] {
    return state.all;
  }

  /**
   * Indica si hay carga activa.
   *
   * @param state Estado completo.
   * @returns True cuando la peticion esta en curso.
   */
  @Selector()
  static getLoading(state: UsersDashboardStateModel): boolean {
    return state.loading;
  }

  /**
   * Devuelve el ultimo error visible.
   *
   * @param state Estado completo.
   * @returns Mensaje de error.
   */
  @Selector()
  static getError(state: UsersDashboardStateModel): string {
    return state.error;
  }

  /**
   * Carga usuarios por seccion.
   *
   * @param ctx Contexto de NGXS.
   * @param action Accion con la seccion a cargar.
   * @returns Observable de la peticion.
   */
  @Action(LoadUsersDashboard)
  loadUsers(ctx: StateContext<UsersDashboardStateModel>, action: LoadUsersDashboard) {
    ctx.patchState({ loading: true, error: '' });
    return this.api.list(this.toRoleFilter(action.section)).pipe(
      tap((response) => this.patchSection(ctx, action.section, this.extractList(response))),
      catchError((error) => this.fail(ctx, error)),
      finalize(() => ctx.patchState({ loading: false })),
    );
  }

  /**
   * Guarda o actualiza un usuario.
   *
   * @param ctx Contexto de NGXS.
   * @param action Accion con payload y seccion.
   * @returns Observable de la peticion.
   */
  @Action(SaveUsersDashboardProfile)
  saveUserProfile(ctx: StateContext<UsersDashboardStateModel>, action: SaveUsersDashboardProfile) {
    ctx.patchState({ loading: true, error: '' });
    const request = action.userId
      ? this.api.updateProfile(action.userId, action.payload)
      : this.api.add(action.payload.registerUserDTO);

    return request.pipe(
      tap((response) => this.upsertUser(ctx, {
        section: action.section,
        userId: action.userId,
        item: this.extractItem(response),
        response,
      })),
      catchError((error) => this.fail(ctx, error)),
      finalize(() => ctx.patchState({ loading: false })),
    );
  }

  /**
   * Elimina un usuario.
   *
   * @param ctx Contexto de NGXS.
   * @param action Accion con seccion e id.
   * @returns Observable de la peticion.
   */
  @Action(DeleteUsersDashboard)
  deleteUser(ctx: StateContext<UsersDashboardStateModel>, action: DeleteUsersDashboard) {
    ctx.patchState({ loading: true, error: '' });
    return this.api.delete(action.userId).pipe(
      tap((response) => this.removeUser(ctx, action.section, action.userId, response)),
      catchError((error) => this.fail(ctx, error)),
      finalize(() => ctx.patchState({ loading: false })),
    );
  }

  /**
   * Convierte una seccion visual al nombre real de rol de negocio.
   *
   * @param section Seccion activa.
   * @returns Nombre de rol esperado por `/user/all-by-role` o null para `/user/all`.
   */
  private toRoleFilter(section: UserSection): RoleFilter | null {
    if (section === 'all') {
      return null;
    }
    return section === 'employees' ? 'EMPLEADO' : 'USUARIO';
  }

  /**
   * Obtiene la lista desde una respuesta estandar.
   *
   * @param response Respuesta del backend.
   * @returns Lista normalizada.
   */
  private extractList(response?: PlantillaResponse<Record<string, unknown>>): Record<string, unknown>[] {
    return this.normalizeList(response?.dataList ?? response?.data);
  }

  /**
   * Obtiene un item desde la respuesta estandar.
   *
   * @param response Respuesta del backend.
   * @returns Registro plano o indefinido.
   */
  private extractItem(response?: PlantillaResponse<Record<string, unknown>>): Record<string, unknown> | undefined {
    return this.toRecord(response?.data) ?? this.normalizeList(response?.dataList)[0];
  }

  /**
   * Aplica la nueva lista a la seccion correspondiente.
   *
   * @param ctx Contexto de NGXS.
   * @param section Seccion afectada.
   * @param items Lista a persistir.
   */
  private patchSection(ctx: StateContext<UsersDashboardStateModel>, section: UserSection, items: Record<string, unknown>[]): void {
    ctx.patchState({ ...this.sectionPatch(section, items), loading: false, error: '' });
  }

  /**
   * Inserta o reemplaza un usuario en cache.
   *
   * @param ctx Contexto de NGXS.
   * @param section Seccion afectada.
   * @param userId Identificador de respaldo.
   * @param item Registro retornado por el backend.
   */
  private upsertUser(
    ctx: StateContext<UsersDashboardStateModel>,
    result: UserUpsertResult,
  ): void {
    const state = ctx.getState();
    const list = this.sectionList(state, result.section);
    const next = this.upsertItem(list, result.item, result.userId);
    ctx.patchState({ ...result.response, ...this.sectionPatch(result.section, next), loading: false, error: '' });
  }

  /**
   * Elimina un usuario de la cache local.
   *
   * @param ctx Contexto de NGXS.
   * @param section Seccion afectada.
   * @param userId Identificador del usuario.
   */
  private removeUser(
    ctx: StateContext<UsersDashboardStateModel>,
    section: UserSection,
    userId: string,
    response: PlantillaResponse<Record<string, unknown>>,
  ): void {
    const state = ctx.getState();
    const list = this.sectionList(state, section);
    const next = list.filter((item) => this.resolveId(item) !== userId);
    ctx.patchState({ ...response, ...this.sectionPatch(section, next), loading: false, error: '' });
  }

  /**
   * Devuelve la lista de una seccion.
   *
   * @param state Estado completo.
   * @param section Seccion solicitada.
   * @returns Lista cacheada.
   */
  private sectionList(state: UsersDashboardStateModel, section: UserSection): Record<string, unknown>[] {
    if (section === 'all') {
      return state.all;
    }
    return section === 'employees' ? state.employees : state.clients;
  }

  /**
   * Construye el parche para una seccion.
   *
   * @param section Seccion afectada.
   * @param items Lista nueva.
   * @returns Objeto parcial del estado.
   */
  private sectionPatch(section: UserSection, items: Record<string, unknown>[]): Partial<UsersDashboardStateModel> {
    if (section === 'all') {
      return { all: items };
    }
    return section === 'employees' ? { employees: items } : { clients: items };
  }

  /**
   * Reemplaza o agrega un item por id.
   *
   * @param list Lista original.
   * @param item Registro a persistir.
   * @param fallbackId Identificador de respaldo.
   * @returns Lista actualizada.
   */
  private upsertItem(list: Record<string, unknown>[], item: Record<string, unknown> | undefined, fallbackId: string | null): Record<string, unknown>[] {
    if (!item) {
      return list;
    }

    const targetId = this.resolveId(item) || fallbackId || '';
    if (!targetId) {
      return [...list, item];
    }

    const replaced = list.map((row) => (this.resolveId(row) === targetId ? item : row));
    return replaced.some((row) => this.resolveId(row) === targetId) ? replaced : [...replaced, item];
  }

  /**
   * Resuelve el identificador de un registro plano.
   *
   * @param item Registro fuente.
   * @returns Id serializado o cadena vacia.
   */
  private resolveId(item: Record<string, unknown>): string {
    return String(item['id'] ?? item['id_usuario'] ?? item['idUser'] ?? '').trim();
  }

  /**
   * Normaliza una lista heterogenea.
   *
   * @param value Valor retornado por el backend.
   * @returns Lista de registros planos.
   */
  private normalizeList(value: unknown): Record<string, unknown>[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.map((item) => this.toRecord(item)).filter((item): item is Record<string, unknown> => !!item);
  }

  /**
   * Convierte un valor a registro plano.
   *
   * @param value Valor a evaluar.
   * @returns Registro plano o indefinido.
   */
  private toRecord(value: unknown): Record<string, unknown> | undefined {
    if (!value || typeof value !== 'object') {
      return undefined;
    }

    return value as Record<string, unknown>;
  }

  /**
   * Resuelve un mensaje seguro para UI.
   *
   * @param error Error recibido.
   * @returns Mensaje de texto.
   */
  private resolveMessage(error: unknown): string {
    if (!error || typeof error !== 'object') {
      return '';
    }

    const payload = error as { error?: { message?: string }; message?: string };
    return String(payload.error?.message ?? payload.message ?? '');
  }

  /**
   * Marca el estado como fallido sin romper el dispatch.
   *
   * @param ctx Contexto de NGXS.
   * @param error Error capturado.
   * @returns Observable vacio.
   */
  private fail(ctx: StateContext<UsersDashboardStateModel>, error: unknown) {
    const response = this.emptyResponse(error);
    ctx.patchState({ ...response, loading: false, error: response.message });
    return of(response);
  }

  /**
   * Genera una respuesta vacia compatible con la UI.
   *
   * @returns Respuesta estandar vacia.
   */
  private emptyResponse(error?: unknown): PlantillaResponse<Record<string, unknown>> {
    return { data: undefined, dataList: [], message: this.resolveMessage(error) || 'No fue posible sincronizar usuarios.', rta: false, httpStatus: 500 };
  }
}
