import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAuthEccomerce1 } from './form-auth-eccomerce1';

describe('FormAuthEccomerce1', () => {
  let component: FormAuthEccomerce1;
  let fixture: ComponentFixture<FormAuthEccomerce1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAuthEccomerce1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAuthEccomerce1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
