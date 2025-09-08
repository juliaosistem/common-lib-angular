import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputsLoginEcommerce1 } from './inputs-login-ecommerce1';

describe('InputsLoginEcommerce1', () => {
  let component: InputsLoginEcommerce1;
  let fixture: ComponentFixture<InputsLoginEcommerce1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputsLoginEcommerce1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputsLoginEcommerce1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
