import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, of, tap } from 'rxjs';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { RolesActions } from './users-dashboard/roles.action';
import { RoleCrudDto, RolesService } from '../../services/roles.service';

interface RolesStateModel extends PlantillaResponse<RoleCrudDto> {
	loading: boolean;
	error: string;
}

const initialState: RolesStateModel = {
	data: undefined,
	dataList: [],
	message: '',
	rta: false,
	httpStatus: undefined,
	loading: false,
	error: '',
};

@State<RolesStateModel>({
	name: 'roles',
	defaults: initialState,
})
@Injectable()
export class RolesState {
	constructor(private readonly rolesService: RolesService) {}

	/**
	 * Devuelve la lista cacheada de roles.
	 *
	 * @param state Estado completo del slice.
	 * @returns Lista normalizada de roles.
	 */
	@Selector()
	static getRoles(state: RolesStateModel): RoleCrudDto[] {
		return state.dataList ?? [];
	}

	/**
	 * Informa si existe una operacion pendiente sobre roles.
	 *
	 * @param state Estado completo del slice.
	 * @returns True cuando hay carga activa.
	 */
	@Selector()
	static getLoading(state: RolesStateModel): boolean {
		return state.loading;
	}

	/**
	 * Devuelve el ultimo error visible asociado al CRUD de roles.
	 *
	 * @param state Estado completo del slice.
	 * @returns Mensaje de error listo para UI.
	 */
	@Selector()
	static getError(state: RolesStateModel): string {
		return state.error;
	}

	/**
	 * Carga la lista de roles desde el backend.
	 *
	 * @param ctx Contexto del estado NGXS.
	 * @param action Accion con el id opcional a consultar.
	 * @returns Observable del request HTTP.
	 */
	@Action(RolesActions.All)
	loadRoles(ctx: StateContext<RolesStateModel>, action: InstanceType<typeof RolesActions.All>) {
		ctx.patchState(this.startLoading());
		return this.rolesService.list(this.resolveActionId(action.payload)).pipe(
			tap((response: PlantillaResponse<RoleCrudDto>) => ctx.patchState(this.mapLoadedState(response))),
			catchError((error) => this.fail(ctx, error)),
		);
	}

	/**
	 * Crea un nuevo rol y actualiza la cache local.
	 *
	 * @param ctx Contexto del estado NGXS.
	 * @param action Accion con el payload a persistir.
	 * @returns Observable del request HTTP.
	 */
	@Action(RolesActions.Add)
	createRole(ctx: StateContext<RolesStateModel>, action: InstanceType<typeof RolesActions.Add>) {
		ctx.patchState(this.startLoading());
		return this.rolesService.create(action.payload).pipe(
			tap((response: PlantillaResponse<RoleCrudDto>) => ctx.patchState(this.mapUpsertState(ctx.getState(), response))),
			catchError((error) => this.fail(ctx, error)),
		);
	}

	/**
	 * Actualiza un rol existente y reemplaza su registro en cache.
	 *
	 * @param ctx Contexto del estado NGXS.
	 * @param action Accion con el id y payload del rol.
	 * @returns Observable del request HTTP.
	 */
	@Action(RolesActions.Update)
	updateRole(ctx: StateContext<RolesStateModel>, action: InstanceType<typeof RolesActions.Update>) {
		ctx.patchState(this.startLoading());
		const roleId = this.resolveActionId(action.queryParams);
		if (!roleId) {
			return this.fail(ctx, new Error('Id de rol requerido para actualizar.'));
		}
		return this.rolesService.update(roleId, action.payload).pipe(
			tap((response: PlantillaResponse<RoleCrudDto>) => ctx.patchState(this.mapUpsertState(ctx.getState(), response, roleId))),
			catchError((error) => this.fail(ctx, error)),
		);
	}

	/**
	 * Elimina un rol del backend y de la cache local.
	 *
	 * @param ctx Contexto del estado NGXS.
	 * @param action Accion con el id del rol.
	 * @returns Observable del request HTTP.
	 */
	@Action(RolesActions.Delete)
	deleteRole(ctx: StateContext<RolesStateModel>, action: InstanceType<typeof RolesActions.Delete>) {
		ctx.patchState(this.startLoading());
		const roleId = this.resolveActionId(action.queryParams);
		if (!roleId) {
			return this.fail(ctx, new Error('Id de rol requerido para eliminar.'));
		}
		return this.rolesService.delete(roleId).pipe(
			tap((response: PlantillaResponse<RoleCrudDto>) => ctx.patchState(this.mapDeleteState(ctx.getState(), response, roleId))),
			catchError((error) => this.fail(ctx, error)),
		);
	}

	/**
	 * Construye el parche base de estado para iniciar una operacion.
	 *
	 * @returns Estado parcial con loading activo.
	 */
	private startLoading(): Partial<RolesStateModel> {
		return { loading: true, error: '' };
	}

	/**
	 * Convierte una respuesta de consulta en estado listo para UI.
	 *
	 * @param response Respuesta del backend.
	 * @returns Estado parcial normalizado.
	 */
	private mapLoadedState(response: PlantillaResponse<RoleCrudDto>): Partial<RolesStateModel> {
		return { ...this.mapResponse(response), dataList: this.extractList(response), loading: false, error: '' };
	}

	/**
	 * Inserta o reemplaza un rol dentro de la cache local.
	 *
	 * @param state Estado actual.
	 * @param response Respuesta del backend.
	 * @param fallbackId Id de respaldo cuando la respuesta no lo trae.
	 * @returns Estado parcial con la lista actualizada.
	 */
	private mapUpsertState(
		state: RolesStateModel,
		response: PlantillaResponse<RoleCrudDto>,
		fallbackId?: string,
	): Partial<RolesStateModel> {
		const item = this.extractItem(response, fallbackId);
		return { ...this.mapResponse(response), dataList: this.upsertItem(state.dataList ?? [], item), loading: false, error: '' };
	}

	/**
	 * Remueve un rol de la cache local despues de eliminarlo.
	 *
	 * @param state Estado actual.
	 * @param response Respuesta del backend.
	 * @param roleId Identificador eliminado.
	 * @returns Estado parcial con la lista resultante.
	 */
	private mapDeleteState(
		state: RolesStateModel,
		response: PlantillaResponse<RoleCrudDto>,
		roleId: string,
	): Partial<RolesStateModel> {
		return { ...this.mapResponse(response), dataList: this.removeItem(state.dataList ?? [], roleId), loading: false, error: '' };
	}

	/**
	 * Normaliza la respuesta comun del backend hacia el slice de roles.
	 *
	 * @param response Respuesta cruda del backend.
	 * @returns Estado parcial con data, mensaje y estado HTTP.
	 */
	private mapResponse(response: PlantillaResponse<RoleCrudDto>): Partial<RolesStateModel> {
		return { data: this.normalizeRole(response.data), message: response.message ?? '', rta: Boolean(response.rta), httpStatus: response.httpStatus };
	}

	/**
	 * Obtiene la lista de roles desde una respuesta estandar.
	 *
	 * @param response Respuesta del backend.
	 * @returns Lista normalizada de roles.
	 */
	private extractList(response: PlantillaResponse<RoleCrudDto>): RoleCrudDto[] {
		return this.normalizeList(response.dataList ?? response.data);
	}

	/**
	 * Obtiene un rol puntual desde data o dataList.
	 *
	 * @param response Respuesta del backend.
	 * @param fallbackId Identificador de respaldo.
	 * @returns Rol normalizado o indefinido.
	 */
	private extractItem(response: PlantillaResponse<RoleCrudDto>, fallbackId?: string): RoleCrudDto | undefined {
		const item = this.normalizeRole(response.data) ?? this.normalizeList(response.dataList)[0];
		return item ? { ...item, id: item.id ?? fallbackId } : undefined;
	}

	/**
	 * Normaliza un valor desconocido a una lista de roles.
	 *
	 * @param value Valor retornado por el backend.
	 * @returns Lista plana de roles.
	 */
	private normalizeList(value: unknown): RoleCrudDto[] {
		if (!Array.isArray(value)) {
			return [];
		}
		return value.map((item) => this.normalizeRole(item)).filter((item): item is RoleCrudDto => Boolean(item));
	}

	/**
	 * Homologa id e idRol para el consumo del frontend.
	 *
	 * @param value Valor crudo del backend.
	 * @returns Rol normalizado o indefinido.
	 */
	private normalizeRole(value: unknown): RoleCrudDto | undefined {
		if (!value || typeof value !== 'object') {
			return undefined;
		}
		const role = value as RoleCrudDto;
		return { ...role, id: role.id ?? role.idRol, idRol: role.idRol ?? role.id };
	}

	/**
	 * Inserta o reemplaza un elemento por id dentro de la lista.
	 *
	 * @param list Lista actual cacheada.
	 * @param item Rol a persistir en cache.
	 * @returns Lista actualizada.
	 */
	private upsertItem(list: RoleCrudDto[], item?: RoleCrudDto): RoleCrudDto[] {
		if (!item) {
			return list;
		}
		const id = this.resolveId(item);
		return id ? this.replaceOrAppend(list, item, id) : [...list, item];
	}

	/**
	 * Reemplaza un item por id o lo agrega al final si no existe.
	 *
	 * @param list Lista actual cacheada.
	 * @param item Rol a insertar o reemplazar.
	 * @param id Identificador normalizado del rol.
	 * @returns Lista actualizada.
	 */
	private replaceOrAppend(list: RoleCrudDto[], item: RoleCrudDto, id: string): RoleCrudDto[] {
		const next = list.map((row) => (this.resolveId(row) === id ? item : row));
		return next.some((row) => this.resolveId(row) === id) ? next : [...next, item];
	}

	/**
	 * Remueve un rol por id desde la lista cacheada.
	 *
	 * @param list Lista actual cacheada.
	 * @param id Identificador del rol a remover.
	 * @returns Lista sin el elemento eliminado.
	 */
	private removeItem(list: RoleCrudDto[], id: string): RoleCrudDto[] {
		return list.filter((item) => this.resolveId(item) !== id);
	}

	/**
	 * Resuelve el id principal de un rol normalizado.
	 *
	 * @param item Rol a inspeccionar.
	 * @returns Id serializado o cadena vacia.
	 */
	private resolveId(item?: RoleCrudDto): string {
		return String(item?.id ?? item?.idRol ?? '').trim();
	}

	/**
	 * Resuelve un identificador de rol desde payloads o query params genericos.
	 *
	 * @param value Objeto candidato con id o idRol.
	 * @returns Identificador serializado o cadena vacia.
	 */
	private resolveActionId(value: unknown): string | undefined {
		if (!value || typeof value !== 'object') {
			return undefined;
		}
		const payload = value as { id?: string | number; idRol?: string | number };
		const id = String(payload.id ?? payload.idRol ?? '').trim();
		return id || undefined;
	}

	/**
	 * Convierte un error desconocido en estado fallido sin romper el dispatch.
	 *
	 * @param ctx Contexto del estado NGXS.
	 * @param error Error capturado del request.
	 * @returns Observable vacio compatible con NGXS.
	 */
	private fail(ctx: StateContext<RolesStateModel>, error: unknown) {
		ctx.patchState({ loading: false, error: this.resolveMessage(error), httpStatus: undefined, rta: false });
		return of(this.emptyResponse());
	}

	/**
	 * Resuelve un mensaje legible desde un error desconocido.
	 *
	 * @param error Error a inspeccionar.
	 * @returns Mensaje listo para mostrar en UI.
	 */
	private resolveMessage(error: unknown): string {
		if (!error || typeof error !== 'object') {
			return 'No fue posible sincronizar roles.';
		}
		const payload = error as { error?: { message?: string }; message?: string };
		return String(payload.error?.message ?? payload.message ?? 'No fue posible sincronizar roles.');
	}

	/**
	 * Genera una respuesta vacia compatible con el flujo de NGXS.
	 *
	 * @returns Respuesta estandar vacia.
	 */
	private emptyResponse(): PlantillaResponse<RoleCrudDto> {
		return { data: undefined, dataList: [], message: '', rta: false, httpStatus: undefined };
	}
}
