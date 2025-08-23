import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProductos1Component } from './card-productos1.component';

describe('CardProductos1Component', () => {
  let component: CardProductos1Component;
  let fixture: ComponentFixture<CardProductos1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardProductos1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardProductos1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
