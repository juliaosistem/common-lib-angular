import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GallerySection1Component } from './gallery-section1.component';

describe('GallerySection1Component', () => {
  let component: GallerySection1Component;
  let fixture: ComponentFixture<GallerySection1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GallerySection1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GallerySection1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
