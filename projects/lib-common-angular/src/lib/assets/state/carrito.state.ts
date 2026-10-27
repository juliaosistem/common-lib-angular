import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Action, Actions, Selector, State, StateContext, ofActionDispatched } from '@ngxs/store';
import { CarritoDTO, MediosPagosDTO } from '@juliaosistem/core-dtos';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { Observable, catchError, finalize, map, switchMap, takeUntil, tap, throwError, timeout } from 'rxjs';
import { GenericCrudState, LazyGenericCrudHttpService } from './state-generic/generic-crud.state';
import { CarritoActions, CarritoUi, ConfirmarCarrito, LoadMediosPagos, ResetCarrito } from './carrito.actions';
import { LibConfigService } from '../../config/lib-config.service';
import { getSessionBusinessClaims, getSessionToken } from '../../utils/business-token.util';
import { AbstractLogger } from '../../services/abstract-logger.service';

export type CarritoViewState = PlantillaResponse<CarritoDTO> & {
  loading: boolean;
  drawerOpen: boolean;
  mediosPagos: MediosPagosDTO[];
  confirmed: boolean;
};

const emptyResponse: PlantillaResponse<CarritoDTO> = {
  data: undefined, dataList: [], rta: true, message: '', httpStatus: 200,
};

const defaults: CarritoViewState = {
  ...emptyResponse,
  loading: false, drawerOpen: false, mediosPagos: [], confirmed: false,
};

@State<CarritoViewState>({ name: 'carrito', defaults })
@Injectable()
export class CarritoState extends GenericCrudState<CarritoDTO, CarritoDTO> {
  private readonly http = inject(HttpClient);
  private readonly config = inject(LibConfigService);
  private readonly logger = inject(AbstractLogger);
  private readonly actionStream = inject(Actions);

  constructor() {
    super(new LazyGenericCrudHttpService<CarritoDTO>('baseUrlCarrito'), CarritoActions);
  }

  @Selector()
  static getCarritoView(state: CarritoViewState): CarritoViewState {
    return state;
  }

  /** Carga solo el carrito del usuario identificado por el businessToken. */
  @Action(CarritoActions.All, { cancelUncompleted: true })
  loadCart(ctx: StateContext<CarritoViewState>) {
    return this.execute(ctx, this.fetchCart()).pipe(tap(response => ctx.patchState(response)));
  }

  /** @param action Carrito nuevo construido con precios del catalogo. */
  @Action(CarritoActions.Add)
  createCart(ctx: StateContext<CarritoViewState>, action: InstanceType<typeof CarritoActions.Add>) {
    return this.saveCart(ctx, this.service.add(action.payload, this.metadata()));
  }

  /** @param action Carrito existente con sus cantidades actualizadas. */
  @Action(CarritoActions.Update)
  updateCart(ctx: StateContext<CarritoViewState>, action: InstanceType<typeof CarritoActions.Update>) {
    const id = action.payload.id;
    if (!id) return this.fail(ctx, new Error('El carrito no tiene un identificador válido.'));
    return this.saveCart(ctx, this.service.update({ ...action.payload, id }, this.metadata()));
  }

  /** @param action Identificador del carrito vaciado por el usuario. */
  @Action(CarritoActions.Delete)
  deleteCart(ctx: StateContext<CarritoViewState>, action: InstanceType<typeof CarritoActions.Delete>) {
    const request = this.service.delete(String(action.queryParams.id), this.metadata());
    return this.execute(ctx, request).pipe(tap(() => ctx.patchState({ data: undefined, dataList: [], confirmed: false })));
  }

  /** Carga mock offline vacio sin inventar productos ni precios. */
  @Action(CarritoActions.LoadMock)
  loadMockCart(ctx: StateContext<CarritoViewState>): void {
    ctx.setState({ ...defaults, message: 'Carrito mock vacío (sin conexión).' });
  }

  @Action(ResetCarrito)
  reset(ctx: StateContext<CarritoViewState>): void {
    ctx.setState({ ...defaults });
  }

  @Action(CarritoUi)
  ui(ctx: StateContext<CarritoViewState>, action: CarritoUi): void {
    ctx.patchState(action.payload);
  }

  /** Obtiene los medios reales; una lista vacia no habilita la confirmacion. */
  @Action(LoadMediosPagos)
  loadPayments(ctx: StateContext<CarritoViewState>) {
    const request = this.http.get<PlantillaResponse<MediosPagosDTO>>(this.url('baseUrlMediosPagos') + '/all',
      { headers: this.headers() });
    return this.execute(ctx, request).pipe(tap(response => ctx.patchState({ mediosPagos: response.dataList ?? [] })));
  }

  /** @param action Medio de pago seleccionado; confirmar no implica cobrar. */
  @Action(ConfirmarCarrito)
  confirm(ctx: StateContext<CarritoViewState>, action: ConfirmarCarrito) {
    const state = ctx.getState();
    if (state.confirmed || !state.data?.id || !state.data.items.length || !state.mediosPagos.some(p => p.id === action.medioPagoId)) {
      return this.fail(ctx, new Error('Selecciona un carrito y un medio de pago válidos.'));
    }
    const request = this.http.post<PlantillaResponse<CarritoDTO>>(this.url('baseUrlCarrito'),
      { idCarrito: state.data.id, medioPagoId: action.medioPagoId }, { headers: this.headers(action.medioPagoId) });
    return this.execute(ctx, request).pipe(tap(response => ctx.patchState({
      message: response.message || 'Confirmación enviada. No se ha realizado ningún cobro.', rta: true, confirmed: true,
    })));
  }

  private saveCart(ctx: StateContext<CarritoViewState>, request: Observable<PlantillaResponse<CarritoDTO>>) {
    const saved = request.pipe(
      tap(response => this.assertSuccess(response)),
      switchMap(() => this.fetchCart()),
      tap(response => {
        if (!response.data?.id) throw new Error('El servicio no devolvió el carrito guardado. Vuelve a cargarlo.');
      }),
    );
    return this.execute(ctx, saved).pipe(tap(response => ctx.patchState({ ...response, drawerOpen: true, confirmed: false })));
  }

  private fetchCart(): Observable<PlantillaResponse<CarritoDTO>> {
    const idUsuario = String(getSessionBusinessClaims()?.id ?? '');
    const claims = getSessionBusinessClaims();
    if (!idUsuario || !claims?.exp || claims.exp * 1000 <= Date.now()) {
      return throwError(() => new Error('Debes iniciar sesión para usar el carrito.'));
    }
    return this.http.get<PlantillaResponse<CarritoDTO | CarritoDTO[]>>(this.url('baseUrlCarrito') + '/all', {
      params: { idUsuario }, headers: this.headers(),
    }).pipe(map(response => this.normalize(response)));
  }

  private normalize(response: PlantillaResponse<CarritoDTO | CarritoDTO[]>): PlantillaResponse<CarritoDTO> {
    if (response.httpStatus === 404) return { ...emptyResponse };
    this.assertSuccess(response);
    const carts = this.extractCarts(response).sort((a, b) => String(b.fechaActualizacion ?? '').localeCompare(a.fechaActualizacion ?? ''));
    const cart = carts[0];
    if (!cart) return { ...emptyResponse };
    if (!cart.monedaTotal?.codigo_iso || !Array.isArray(cart.items)) throw new Error('El servicio devolvió un carrito inválido.');
    const items = cart.items.map(item => {
      if (!Number.isInteger(Number(item.cantidad)) || Number(item.cantidad) <= 0 || !Number.isFinite(Number(item.subtotal)) || Number(item.subtotal) < 0) {
        throw new Error('El servicio devolvió una cantidad o un subtotal inválido.');
      }
      return { ...item, cantidad: Number(item.cantidad), subtotal: Number(item.subtotal),
        moneda: { ...item.moneda, precio: Number(item.subtotal) / Number(item.cantidad) } };
    });
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const data = { ...cart, items, total, monedaTotal: { ...cart.monedaTotal, precio: total } };
    return { data, dataList: [data], rta: true, httpStatus: 200, message: '' };
  }

  private extractCarts(response: PlantillaResponse<CarritoDTO | CarritoDTO[]>): CarritoDTO[] {
    const raw = response.dataList ?? (Array.isArray(response.data) ? response.data : response.data ? [response.data] : []);
    const carts: CarritoDTO[] = [];
    for (const value of raw) carts.push(...(Array.isArray(value) ? value : [value]));
    return carts;
  }

  private execute<T>(ctx: StateContext<CarritoViewState>, request: Observable<PlantillaResponse<T>>) {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      ctx.patchState({ loading: false });
    };
    this.logger.logInfo('[ENTRADA] carrito request', 'CarritoState');
    ctx.patchState({ loading: true, message: '', rta: true });
    return request.pipe(timeout(15000), takeUntil(this.actionStream.pipe(ofActionDispatched(ResetCarrito, CarritoActions.LoadMock))),
      tap({ next: response => {
        this.assertSuccess(response);
        this.logger.logInfo('[SALIDA] carrito request exitoso', 'CarritoState');
      }, complete: finish }),
      catchError((error: unknown) => { finish(); return this.fail(ctx, error); }),
      finalize(finish),
    );
  }

  private assertSuccess<T>(response: PlantillaResponse<T>): void {
    if (response.rta !== true || (response.httpStatus !== undefined && response.httpStatus >= 400)) {
      throw new Error(response.message || 'La operación del carrito fue rechazada.');
    }
  }

  private fail(ctx: StateContext<CarritoViewState>, error: unknown): Observable<never> {
    const message = error instanceof HttpErrorResponse ? 'No fue posible contactar el servicio del carrito.'
      : error instanceof Error ? error.message : 'Error en el carrito.';
    this.logger.logError(new Error(message), 'CarritoState');
    ctx.patchState({ rta: false, message, loading: false, drawerOpen: true });
    return throwError(() => new Error(message));
  }

  private metadata() {
    const claims = getSessionBusinessClaims();
    const idbusiness = Number(claims?.['idBusiness'] ?? claims?.idbusiness);
    if (!Number.isInteger(idbusiness) || idbusiness <= 0) throw new Error('La sesión no contiene un negocio válido.');
    return {
      idbusiness,
      usuario: String(claims?.usuario ?? claims?.email ?? claims?.id ?? ''),
      token: getSessionToken() ?? '', topic: 'carrito', proceso: 'guardar',
      ip: '', dominio: 'ecommerce',
    };
  }

  private headers(topic = 'carrito'): HttpHeaders {
    return new HttpHeaders({ ...this.metadata(), topic,
      idbusiness: String(this.metadata().idbusiness), Authorization: `Bearer ${getSessionToken() ?? ''}` });
  }

  private url(key: string): string {
    const url = this.config.get<string>(key);
    if (!url) throw new Error(`Falta configurar ${key}.`);
    return url.replace(/\/$/, '');
  }
}
