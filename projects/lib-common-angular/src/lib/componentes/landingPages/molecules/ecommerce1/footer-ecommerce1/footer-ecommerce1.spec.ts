import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterEcommerce1 } from './footer-ecommerce1';

describe('FooterEcommerce1', () => {
  let component: FooterEcommerce1;
  let fixture: ComponentFixture<FooterEcommerce1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterEcommerce1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterEcommerce1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
