import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCarritoDemo } from './detalle-carrito-demo';

describe('DetalleCarritoDemo', () => {
  let component: DetalleCarritoDemo;
  let fixture: ComponentFixture<DetalleCarritoDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleCarritoDemo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleCarritoDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
