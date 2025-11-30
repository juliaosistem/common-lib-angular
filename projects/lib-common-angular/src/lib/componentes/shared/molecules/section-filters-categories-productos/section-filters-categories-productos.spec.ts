import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionFiltersCategoriesProductos } from './section-filters-categories-productos';

describe('SectionFiltersCategoriesProductos', () => {
  let component: SectionFiltersCategoriesProductos;
  let fixture: ComponentFixture<SectionFiltersCategoriesProductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionFiltersCategoriesProductos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionFiltersCategoriesProductos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
