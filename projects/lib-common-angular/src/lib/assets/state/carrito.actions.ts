import { createGenericCrudActions } from './state-generic/generic-crud.actions';
import { CarritoDTO } from '@juliaosistem/core-dtos';

export const CarritoActions = createGenericCrudActions<CarritoDTO>('Carrito');

export class CarritoUi {
  static readonly type = '[Carrito] UI';
  constructor(public payload: { drawerOpen?: boolean; message?: string; rta?: boolean }) {}
}

export class ResetCarrito {
  static readonly type = '[Carrito] Reset';
}

export class LoadMediosPagos {
  static readonly type = '[Carrito] Medios de pago';
}

export class ConfirmarCarrito {
  static readonly type = '[Carrito] Confirmar';
  constructor(public medioPagoId: string) {}
}
