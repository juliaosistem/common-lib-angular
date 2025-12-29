import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShWatsButtonCard } from './sh-wats-button-card';

describe('ShWatsButtonCard', () => {
  let component: ShWatsButtonCard;
  let fixture: ComponentFixture<ShWatsButtonCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShWatsButtonCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShWatsButtonCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
