import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterEcommerce1 } from './register-ecommerce1';

describe('RegisterEcommerce1', () => {
  let component: RegisterEcommerce1;
  let fixture: ComponentFixture<RegisterEcommerce1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterEcommerce1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterEcommerce1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
