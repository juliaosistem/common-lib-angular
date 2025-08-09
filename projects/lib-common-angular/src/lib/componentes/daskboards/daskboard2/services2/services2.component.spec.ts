import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Services2Component } from './services2.component';

describe('Services2Component', () => {
  let component: Services2Component;
  let fixture: ComponentFixture<Services2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Services2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Services2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
