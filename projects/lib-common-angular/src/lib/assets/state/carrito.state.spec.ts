import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { CarritoDTO, ProductoDTO } from '@juliaosistem/core-dtos';
import { CarritoState } from './carrito.state';
import { CarritoActions, CarritoUi, ConfirmarCarrito, LoadMediosPagos, ResetCarrito } from './carrito.actions';
import { setLibraryInjector } from '../../utils/library-injector';
import { AbstractLogger } from '../../services/abstract-logger.service';
import { QueryParams } from 'juliaositembackenexpress/dist/utils/queryParams';
import { switchMap } from 'rxjs';

describe('CarritoState', () => {
  let store: Store;
  let http: HttpTestingController;
  const currency = { id: 1, codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 10 };
  const product: ProductoDTO = {
    id: 'producto-test', name: 'Inflable', precios: [currency], cantidad: 5,
    idCategoria: 'categoria-test', imagen: [], estado: 'ACTIVO', idDatosUsuario: 'usuario-test',
  };
  const cart: CarritoDTO = {
    id: 'carrito-test', idUsuario: 'usuario-test', total: 20, monedaTotal: { ...currency, precio: 20 },
    items: [{ producto: product, cantidad: 2, subtotal: 20, moneda: currency }],
  };
  const params: QueryParams = { ip: '', dominio: 'test', usuario: '', idbusiness: 0, proceso: 'guardar' };
  const state = () => store.selectSnapshot(CarritoState.getCarritoView);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([CarritoState])],
      providers: [{ provide: AbstractLogger, useValue: jasmine.createSpyObj('Logger', ['logInfo', 'logError']) }],
    });
    store = TestBed.inject(Store);
    http = TestBed.inject(HttpTestingController);
    setLibraryInjector(TestBed.inject(Injector));
    const claims = { id: 'usuario-test', idBusiness: 77, usuario: 'operario', exp: Math.floor(Date.now() / 1000) + 300 };
    sessionStorage.setItem('businessToken', `header.${btoa(JSON.stringify(claims))}.signature`);
  });

  afterEach(() => {
    http.verify();
    sessionStorage.removeItem('businessToken');
  });

  it('expone los campos de UI mediante un selector tipado reactivo', () => {
    const views: boolean[] = [];
    const subscription = store.select(CarritoState.getCarritoView).subscribe(view => views.push(view.drawerOpen));
    store.dispatch(new CarritoUi({ drawerOpen: true })).subscribe();
    expect(views).toEqual([false, true]);
    expect(state().mediosPagos).toEqual([]);
    expect(state().confirmed).toBeFalse();
    subscription.unsubscribe();
  });

  it('interpreta el 404 del envoltorio como carrito vacio, no como fallo de red', () => {
    store.dispatch(new CarritoUi({ drawerOpen: true })).subscribe();
    store.dispatch(new CarritoActions.All(params)).subscribe();
    const request = http.expectOne('http://localhost:3000/carrito/all?idUsuario=usuario-test');
    expect(request.request.headers.get('idbusiness')).toBe('77');
    expect(request.request.headers.get('usuario')).toBe('operario');
    request.flush({ rta: false, httpStatus: 404, data: [] });
    expect(state().data).toBeUndefined();
    expect(state().rta).toBeTrue();
    expect(state().loading).toBeFalse();
    expect(state().drawerOpen).toBeTrue();
  });

  it('normaliza decimales de TypeORM y calcula el precio unitario, no el subtotal', () => {
    store.dispatch(new CarritoActions.All(params)).subscribe();
    http.expectOne('http://localhost:3000/carrito/all?idUsuario=usuario-test').flush({
      rta: true, httpStatus: 200,
      data: [{ ...cart, total: '20.00', items: [{ ...cart.items[0], subtotal: '20.00', moneda: { ...currency, precio: undefined } }] }],
    });
    expect(state().data?.items[0].moneda.precio).toBe(10);
    expect(state().data?.total).toBe(20);
  });

  it('no transforma un httpStatus=500 dentro de HTTP 200 en un carrito vacio exitoso', () => {
    let errorMessage = '';
    store.dispatch(new CarritoActions.All(params)).subscribe({ error: (error: Error) => errorMessage = error.message });
    http.expectOne('http://localhost:3000/carrito/all?idUsuario=usuario-test')
      .flush({ rta: false, httpStatus: 500, message: 'Fallo persistencia', data: [] });
    expect(errorMessage).toBe('Fallo persistencia');
    expect(state().rta).toBeFalse();
    expect(state().message).toBe('Fallo persistencia');
  });

  it('envia metadatos del businessToken al actualizar y vuelve a consultar la persistencia', () => {
    store.dispatch(new CarritoActions.Update(cart, params)).subscribe();
    const update = http.expectOne('http://localhost:3000/carrito/carrito-test');
    expect(update.request.method).toBe('PUT');
    expect(update.request.headers.get('idbusiness')).toBe('77');
    update.flush({ rta: true, httpStatus: 200, data: cart });
    expect(state().loading).toBeTrue();
    http.expectOne('http://localhost:3000/carrito/all?idUsuario=usuario-test').flush({ rta: true, data: [cart] });
    expect(state().data?.id).toBe(cart.id);
    expect(state().loading).toBeFalse();
  });

  it('cancela cargas pendientes al limpiar la sesion', () => {
    store.dispatch(new CarritoActions.All(params)).subscribe();
    const request = http.expectOne('http://localhost:3000/carrito/all?idUsuario=usuario-test');
    store.dispatch(new ResetCarrito()).subscribe();
    expect(request.cancelled).toBeTrue();
    expect(state().data).toBeUndefined();
  });

  it('no libera loading de una actualizacion al finalizar la carga que la precede', () => {
    store.dispatch(new CarritoActions.All(params)).pipe(
      switchMap(() => store.dispatch(new CarritoActions.Update(cart, params))),
    ).subscribe();
    http.expectOne('http://localhost:3000/carrito/all?idUsuario=usuario-test').flush({ rta: true, data: [cart] });
    expect(state().loading).toBeTrue();
    http.expectOne('http://localhost:3000/carrito/carrito-test').flush({ rta: true, data: cart });
    expect(state().loading).toBeTrue();
    http.expectOne('http://localhost:3000/carrito/all?idUsuario=usuario-test').flush({ rta: true, data: [cart] });
    expect(state().loading).toBeFalse();
  });

  it('no confirma sin medios de pago configurados', () => {
    store.dispatch(new LoadMediosPagos()).subscribe();
    http.expectOne('http://localhost:3000/MedioDepago/all').flush({ rta: true, dataList: [] });
    store.dispatch(new ConfirmarCarrito('inexistente')).subscribe({ error: () => undefined });
    http.expectNone('http://localhost:3000/carrito');
    expect(state().rta).toBeFalse();
  });

  it('soporta LoadMock offline sin llamadas HTTP', () => {
    store.dispatch(new CarritoActions.LoadMock()).subscribe();
    expect(state().dataList).toEqual([]);
    expect(state().message).toContain('mock');
  });
});
