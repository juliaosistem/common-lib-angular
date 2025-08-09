import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonCall1Component } from './button-call1.component';

describe('ButtonCall1Component', () => {
  let component: ButtonCall1Component;
  let fixture: ComponentFixture<ButtonCall1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonCall1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonCall1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
