import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputsRegisterEcommerce1 } from './inputs-register-ecommerce1';

describe('InputsRegisterEcommerce1', () => {
  let component: InputsRegisterEcommerce1;
  let fixture: ComponentFixture<InputsRegisterEcommerce1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputsRegisterEcommerce1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputsRegisterEcommerce1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
