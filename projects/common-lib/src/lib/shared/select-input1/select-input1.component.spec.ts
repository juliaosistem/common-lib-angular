import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectInput1Component } from './select-input1.component';

describe('SelectInput1Component', () => {
  let component: SelectInput1Component;
  let fixture: ComponentFixture<SelectInput1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectInput1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectInput1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
