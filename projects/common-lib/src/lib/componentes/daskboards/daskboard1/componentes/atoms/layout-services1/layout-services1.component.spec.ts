import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutServices1Component } from './layout-services1.component';

describe('LayoutServices1Component', () => {
  let component: LayoutServices1Component;
  let fixture: ComponentFixture<LayoutServices1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutServices1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutServices1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
