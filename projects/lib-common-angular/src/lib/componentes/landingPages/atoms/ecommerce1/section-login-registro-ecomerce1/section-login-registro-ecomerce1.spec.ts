import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionLoginRegistroEcomerce1 } from './section-login-registro-ecomerce1';

describe('SectionLoginRegistroEcomerce1', () => {
  let component: SectionLoginRegistroEcomerce1;
  let fixture: ComponentFixture<SectionLoginRegistroEcomerce1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionLoginRegistroEcomerce1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionLoginRegistroEcomerce1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
