import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { CarritoDTO, ProductoDTO } from '@juliaosistem/core-dtos';
import { Subject, of } from 'rxjs';
import { CartService } from './cart.service';
import { AuthService } from './auth-service';
import { ProductService } from './product.service';
import { AbstractLogger } from './abstract-logger.service';
import { CarritoActions, CarritoUi } from '../assets/state/carrito.actions';
import { CarritoViewState } from '../assets/state/carrito.state';

describe('CartService', () => {
  let service: CartService;
  let store: jasmine.SpyObj<Store>;
  let products: jasmine.SpyObj<ProductService>;
  let state: CarritoViewState;
  const currency = { id: 1, codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 100 };
  const product: ProductoDTO = {
    id: 'producto-test', name: 'Inflable', precios: [currency], descuento: 20, cantidad: 5,
    idCategoria: 'categoria-test', imagen: [], estado: 'ACTIVO', idDatosUsuario: 'usuario-test',
  };

  beforeEach(() => {
    state = { dataList: [], loading: false, drawerOpen: false, mediosPagos: [], confirmed: false, rta: true };
    store = jasmine.createSpyObj<Store>('Store', ['select', 'selectSnapshot', 'dispatch']);
    store.select.and.returnValue(of(state));
    store.selectSnapshot.and.returnValue(state);
    store.dispatch.and.returnValue(of(undefined));
    products = jasmine.createSpyObj<ProductService>('ProductService', ['calculateDiscount']);
    products.calculateDiscount.and.returnValue(80);
    TestBed.configureTestingModule({ providers: [
      { provide: Store, useValue: store }, { provide: ProductService, useValue: products },
      { provide: AuthService, useValue: { isLoggedIn$: of(true) } },
      { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
      { provide: AbstractLogger, useValue: jasmine.createSpyObj('Logger', ['logInfo', 'logError']) },
    ] });
    const claims = { id: 'usuario-test', idBusiness: 77, exp: Math.floor(Date.now() / 1000) + 300 };
    sessionStorage.setItem('businessToken', `header.${btoa(JSON.stringify(claims))}.signature`);
    service = TestBed.inject(CartService);
    store.dispatch.calls.reset();
  });

  afterEach(() => sessionStorage.removeItem('businessToken'));

  it('reutiliza el descuento del catalogo y calcula el subtotal de la cantidad elegida', () => {
    service.addOrUpdateProduct(product, 2).subscribe();
    const action = store.dispatch.calls.allArgs().map(([value]) => value).find(value => value instanceof CarritoActions.Add);
    expect(action instanceof CarritoActions.Add).toBeTrue();
    if (!(action instanceof CarritoActions.Add)) return;
    expect(action.payload.items[0].subtotal).toBe(160);
    expect(action.payload.idUsuario).toBe('usuario-test');
    expect(action.queryParams.idbusiness).toBe(77);
    expect(products.calculateDiscount).toHaveBeenCalled();
  });

  it('no aplica dos veces el descuento al editar una linea persistida', () => {
    const item = { producto: product, cantidad: 2, subtotal: 160, moneda: { ...currency, precio: 80 } };
    state.data = { id: 'carrito-test', idUsuario: 'usuario-test', items: [item], total: 160, monedaTotal: currency };
    service.updateQuantity(item, 3).subscribe();
    expect(products.calculateDiscount).toHaveBeenCalledWith(jasmine.objectContaining({
      descuento: 0, precios: [{ ...currency, precio: 80 }],
    }));
  });

  it('rechaza cantidades superiores a las existencias y muestra un error explicito', () => {
    service.addOrUpdateProduct(product, 6).subscribe();
    const actions = store.dispatch.calls.allArgs().map(([value]) => value);
    expect(actions.some(value => value instanceof CarritoActions.Add)).toBeFalse();
    expect(actions.some(value => value instanceof CarritoUi && value.payload.rta === false)).toBeTrue();
  });

  it('serializa clics rapidos sin perder el ultimo cambio de cantidad', () => {
    const requests = new Subject<{ product: ProductoDTO; quantity: number }>();
    const first = new Subject<CarritoDTO | null>();
    const update = spyOn(service, 'addOrUpdateProduct').and.returnValues(first, of(null));
    service.connectProductRequests(requests).subscribe();
    requests.next({ product, quantity: 1 });
    requests.next({ product, quantity: 2 });
    expect(update).toHaveBeenCalledTimes(1);
    first.complete();
    expect(update).toHaveBeenCalledTimes(2);
    expect(update).toHaveBeenCalledWith(product, 2);
    requests.complete();
  });
});
