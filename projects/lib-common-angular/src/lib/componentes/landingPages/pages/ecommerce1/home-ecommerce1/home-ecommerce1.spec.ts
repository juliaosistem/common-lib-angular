import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeEcommerce1 } from './home-ecommerce1';

describe('HomeEcommerce1', () => {
  let component: HomeEcommerce1;
  let fixture: ComponentFixture<HomeEcommerce1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeEcommerce1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeEcommerce1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
