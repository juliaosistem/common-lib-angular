import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ecommerce1Demo } from './ecommerce1-demo';

describe('Ecommerce1Demo', () => {
  let component: Ecommerce1Demo;
  let fixture: ComponentFixture<Ecommerce1Demo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ecommerce1Demo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ecommerce1Demo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
