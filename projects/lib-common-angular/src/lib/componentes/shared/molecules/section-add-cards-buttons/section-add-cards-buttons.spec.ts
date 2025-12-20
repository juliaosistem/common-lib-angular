import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionAddCardsButtons } from './section-add-cards-buttons';

describe('SectionAddCardsButtons', () => {
  let component: SectionAddCardsButtons;
  let fixture: ComponentFixture<SectionAddCardsButtons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionAddCardsButtons]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionAddCardsButtons);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
