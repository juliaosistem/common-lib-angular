import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroSectionEcommerce1 } from './hero-section-ecommerce1';

describe('HeroSectionEcommerce1', () => {
  let component: HeroSectionEcommerce1;
  let fixture: ComponentFixture<HeroSectionEcommerce1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSectionEcommerce1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroSectionEcommerce1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
