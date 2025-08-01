import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesSection1Component } from './services-section1.component';

describe('ServicesSection1Component', () => {
  let component: ServicesSection1Component;
  let fixture: ComponentFixture<ServicesSection1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesSection1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesSection1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
