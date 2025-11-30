import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionImagesInstagramEcommerce1 } from './section-images-instagram-ecommerce1';

describe('SectionImagesInstagramEcommerce1', () => {
  let component: SectionImagesInstagramEcommerce1;
  let fixture: ComponentFixture<SectionImagesInstagramEcommerce1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionImagesInstagramEcommerce1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionImagesInstagramEcommerce1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
