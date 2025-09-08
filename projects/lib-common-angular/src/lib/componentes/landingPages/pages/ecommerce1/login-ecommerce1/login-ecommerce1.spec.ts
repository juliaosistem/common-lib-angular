import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginEcommerce1 } from './login-ecommerce1';

describe('LoginEcommerce1', () => {
  let component: LoginEcommerce1;
  let fixture: ComponentFixture<LoginEcommerce1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginEcommerce1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginEcommerce1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
