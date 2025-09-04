import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarFloatEcommerce1 } from './bar-float-ecommerce1';

describe('BarFloatEcommerce1', () => {
  let component: BarFloatEcommerce1;
  let fixture: ComponentFixture<BarFloatEcommerce1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarFloatEcommerce1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarFloatEcommerce1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
