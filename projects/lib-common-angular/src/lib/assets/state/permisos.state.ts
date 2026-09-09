import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, of, tap } from 'rxjs';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { PermisosActions } from './users-dashboard/permisos.action';
import { PermisoCrudDto, PermisosService } from '../../services/permisos.service';

interface PermisosStateModel extends PlantillaResponse<PermisoCrudDto> {
	loading: boolean;
	error: string;
}

const initialState: PermisosStateModel = {
	data: undefined,
	dataList: [],
	message: '',
	rta: false,
	httpStatus: undefined,
	loading: false,
	error: '',
};

/**
 * Estado NGXS reutilizable para el catalogo dinamico de permisos.
 * Replica el patron de normalizacion de id usado por RolesState.
 */
@State<PermisosStateModel>({
	name: 'permisos',
	defaults: initialState,
})
@Injectable()
export class PermisosState {
	constructor(private readonly permisosService: PermisosService) {}

	/**
	 * Devuelve la lista cacheada de permisos.
	 *
	 * @param state Estado completo del slice.
	 * @returns Lista normalizada de permisos.
	 */
	@Selector()
	static getPermisos(state: PermisosStateModel): PermisoCrudDto[] {
		return state.dataList ?? [];
	}

	/**
	 * Informa si existe una operacion pendiente sobre permisos.
	 *
	 * @param state Estado completo del slice.
	 * @returns True cuando hay carga activa.
	 */
	@Selector()
	static getLoading(state: PermisosStateModel): boolean {
		return state.loading;
	}

	/**
	 * Devuelve el ultimo error visible asociado al CRUD de permisos.
	 *
	 * @param state Estado completo del slice.
	 * @returns Mensaje de error listo para UI.
	 */
	@Selector()
	static getError(state: PermisosStateModel): string {
		return state.error;
	}

	/**
	 * Carga el catalogo de permisos desde el backend.
	 *
	 * @param ctx Contexto del estado NGXS.
	 * @param action Accion con el id opcional a consultar.
	 * @returns Observable del request HTTP.
	 */
	@Action(PermisosActions.All)
	loadPermisos(ctx: StateContext<PermisosStateModel>, action: InstanceType<typeof PermisosActions.All>) {
		ctx.patchState(this.startLoading());
		return this.permisosService.list(this.resolveActionId(action.payload)).pipe(
			tap((response: PlantillaResponse<PermisoCrudDto>) => ctx.patchState(this.mapLoadedState(response))),
			catchError((error) => this.fail(ctx, error)),
		);
	}

	/**
	 * Crea un nuevo permiso y actualiza la cache local.
	 *
	 * @param ctx Contexto del estado NGXS.
	 * @param action Accion con el payload a persistir.
	 * @returns Observable del request HTTP.
	 */
	@Action(PermisosActions.Add)
	createPermiso(ctx: StateContext<PermisosStateModel>, action: InstanceType<typeof PermisosActions.Add>) {
		ctx.patchState(this.startLoading());
		return this.permisosService.create(action.payload).pipe(
			tap((response: PlantillaResponse<PermisoCrudDto>) => ctx.patchState(this.mapUpsertState(ctx.getState(), response))),
			catchError((error) => this.fail(ctx, error)),
		);
	}

	/**
	 * Actualiza un permiso existente y reemplaza su registro en cache.
	 *
	 * @param ctx Contexto del estado NGXS.
	 * @param action Accion con el id y payload del permiso.
	 * @returns Observable del request HTTP.
	 */
	@Action(PermisosActions.Update)
	updatePermiso(ctx: StateContext<PermisosStateModel>, action: InstanceType<typeof PermisosActions.Update>) {
		ctx.patchState(this.startLoading());
		const permisoId = this.resolveActionId(action.queryParams);
		if (!permisoId) {
			return this.fail(ctx, new Error('Id de permiso requerido para actualizar.'));
		}
		return this.permisosService.update(permisoId, action.payload).pipe(
			tap((response: PlantillaResponse<PermisoCrudDto>) => ctx.patchState(this.mapUpsertState(ctx.getState(), response, permisoId))),
			catchError((error) => this.fail(ctx, error)),
		);
	}

	/**
	 * Elimina un permiso del backend y de la cache local.
	 *
	 * @param ctx Contexto del estado NGXS.
	 * @param action Accion con el id del permiso.
	 * @returns Observable del request HTTP.
	 */
	@Action(PermisosActions.Delete)
	deletePermiso(ctx: StateContext<PermisosStateModel>, action: InstanceType<typeof PermisosActions.Delete>) {
		ctx.patchState(this.startLoading());
		const permisoId = this.resolveActionId(action.queryParams);
		if (!permisoId) {
			return this.fail(ctx, new Error('Id de permiso requerido para eliminar.'));
		}
		return this.permisosService.delete(permisoId).pipe(
			tap((response: PlantillaResponse<PermisoCrudDto>) => ctx.patchState(this.mapDeleteState(ctx.getState(), response, permisoId))),
			catchError((error) => this.fail(ctx, error)),
		);
	}

	/**
	 * Construye el parche base de estado para iniciar una operacion.
	 *
	 * @returns Estado parcial con loading activo.
	 */
	private startLoading(): Partial<PermisosStateModel> {
		return { loading: true, error: '' };
	}

	/**
	 * Convierte una respuesta de consulta en estado listo para UI.
	 *
	 * @param response Respuesta del backend.
	 * @returns Estado parcial normalizado.
	 */
	private mapLoadedState(response: PlantillaResponse<PermisoCrudDto>): Partial<PermisosStateModel> {
		return { ...this.mapResponse(response), dataList: this.extractList(response), loading: false, error: '' };
	}

	/**
	 * Inserta o reemplaza un permiso dentro de la cache local.
	 *
	 * @param state Estado actual.
	 * @param response Respuesta del backend.
	 * @param fallbackId Id de respaldo cuando la respuesta no lo trae.
	 * @returns Estado parcial con la lista actualizada.
	 */
	private mapUpsertState(
		state: PermisosStateModel,
		response: PlantillaResponse<PermisoCrudDto>,
		fallbackId?: string,
	): Partial<PermisosStateModel> {
		const item = this.extractItem(response, fallbackId);
		return { ...this.mapResponse(response), dataList: this.upsertItem(state.dataList ?? [], item), loading: false, error: '' };
	}

	/**
	 * Remueve un permiso de la cache local despues de eliminarlo.
	 *
	 * @param state Estado actual.
	 * @param response Respuesta del backend.
	 * @param permisoId Identificador eliminado.
	 * @returns Estado parcial con la lista resultante.
	 */
	private mapDeleteState(
		state: PermisosStateModel,
		response: PlantillaResponse<PermisoCrudDto>,
		permisoId: string,
	): Partial<PermisosStateModel> {
		return { ...this.mapResponse(response), dataList: this.removeItem(state.dataList ?? [], permisoId), loading: false, error: '' };
	}

	/**
	 * Normaliza la respuesta comun del backend hacia el slice de permisos.
	 *
	 * @param response Respuesta cruda del backend.
	 * @returns Estado parcial con data, mensaje y estado HTTP.
	 */
	private mapResponse(response: PlantillaResponse<PermisoCrudDto>): Partial<PermisosStateModel> {
		return { data: response.data, message: response.message ?? '', rta: Boolean(response.rta), httpStatus: response.httpStatus };
	}

	/**
	 * Obtiene la lista de permisos desde una respuesta estandar.
	 *
	 * @param response Respuesta del backend.
	 * @returns Lista normalizada de permisos.
	 */
	private extractList(response: PlantillaResponse<PermisoCrudDto>): PermisoCrudDto[] {
		return this.normalizeList(response.dataList ?? response.data);
	}

	/**
	 * Obtiene un permiso puntual desde data o dataList.
	 *
	 * @param response Respuesta del backend.
	 * @param fallbackId Identificador de respaldo.
	 * @returns Permiso normalizado o indefinido.
	 */
	private extractItem(response: PlantillaResponse<PermisoCrudDto>, fallbackId?: string): PermisoCrudDto | undefined {
		const item = this.toRecordOrUndefined(response.data) ?? this.normalizeList(response.dataList)[0];
		return item ? { ...item, idPermiso: item.idPermiso ?? fallbackId } : undefined;
	}

	/**
	 * Normaliza un valor desconocido a una lista de permisos.
	 *
	 * @param value Valor retornado por el backend.
	 * @returns Lista plana de permisos.
	 */
	private normalizeList(value: unknown): PermisoCrudDto[] {
		if (!Array.isArray(value)) {
			return [];
		}
		return value.map((item) => this.toRecordOrUndefined(item)).filter((item): item is PermisoCrudDto => Boolean(item));
	}

	/**
	 * Convierte un valor desconocido en un DTO de permiso si aplica.
	 *
	 * @param value Valor crudo del backend.
	 * @returns Permiso normalizado o indefinido.
	 */
	private toRecordOrUndefined(value: unknown): PermisoCrudDto | undefined {
		return value && typeof value === 'object' ? (value as PermisoCrudDto) : undefined;
	}

	/**
	 * Inserta o reemplaza un elemento por id dentro de la lista.
	 *
	 * @param list Lista actual cacheada.
	 * @param item Permiso a persistir en cache.
	 * @returns Lista actualizada.
	 */
	private upsertItem(list: PermisoCrudDto[], item?: PermisoCrudDto): PermisoCrudDto[] {
		if (!item) {
			return list;
		}
		const id = this.resolveId(item);
		if (!id) {
			return [...list, item];
		}
		const next = list.map((row) => (this.resolveId(row) === id ? item : row));
		return next.some((row) => this.resolveId(row) === id) ? next : [...next, item];
	}

	/**
	 * Remueve un permiso por id desde la lista cacheada.
	 *
	 * @param list Lista actual cacheada.
	 * @param id Identificador del permiso a remover.
	 * @returns Lista sin el elemento eliminado.
	 */
	private removeItem(list: PermisoCrudDto[], id: string): PermisoCrudDto[] {
		return list.filter((item) => this.resolveId(item) !== id);
	}

	/**
	 * Resuelve el id principal de un permiso normalizado.
	 *
	 * @param item Permiso a inspeccionar.
	 * @returns Id serializado o cadena vacia.
	 */
	private resolveId(item?: PermisoCrudDto): string {
		return String(item?.idPermiso ?? '').trim();
	}

	/**
	 * Resuelve un identificador de permiso desde payloads o query params genericos.
	 *
	 * @param value Objeto candidato con idPermiso o id.
	 * @returns Identificador serializado o cadena vacia.
	 */
	private resolveActionId(value: unknown): string {
		if (!value || typeof value !== 'object') {
			return '';
		}
		const record = value as { id?: unknown; idPermiso?: unknown };
		return String(record.idPermiso ?? record.id ?? '').trim();
	}

	/**
	 * Resuelve un mensaje seguro para UI a partir de un error HTTP.
	 *
	 * @param error Error recibido desde el interceptor HTTP.
	 * @returns Mensaje de texto listo para mostrar.
	 */
	private resolveMessage(error: unknown): string {
		if (!error || typeof error !== 'object') {
			return '';
		}
		const payload = error as { error?: { message?: string }; message?: string };
		return String(payload.error?.message ?? payload.message ?? 'Error inesperado en el catalogo de permisos.');
	}

	/**
	 * Marca el estado como fallido sin romper el flujo de dispatch.
	 *
	 * @param ctx Contexto del estado NGXS.
	 * @param error Error capturado en el pipeline HTTP.
	 * @returns Observable vacio para continuar el stream de acciones.
	 */
	private fail(ctx: StateContext<PermisosStateModel>, error: unknown) {
		ctx.patchState({ loading: false, error: this.resolveMessage(error) });
		return of(null);
	}
}
