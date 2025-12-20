import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonAddToCard1 } from './button-add-to-card1';

describe('ButtonAddToCard1', () => {
  let component: ButtonAddToCard1;
  let fixture: ComponentFixture<ButtonAddToCard1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonAddToCard1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonAddToCard1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
