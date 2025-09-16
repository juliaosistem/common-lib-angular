import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionHeaderFormsLoginEcomerce1 } from './section-header-forms-login-ecomerce1';

describe('SectionHeaderFormsLoginEcomerce1', () => {
  let component: SectionHeaderFormsLoginEcomerce1;
  let fixture: ComponentFixture<SectionHeaderFormsLoginEcomerce1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionHeaderFormsLoginEcomerce1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionHeaderFormsLoginEcomerce1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
