import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCarrito1Component } from './detalle-carrito-1.component';

describe('DetalleCarrito1Component', () => {
  let component: DetalleCarrito1Component;
  let fixture: ComponentFixture<DetalleCarrito1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleCarrito1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleCarrito1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
