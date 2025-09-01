import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderEcommerce1 } from './header-ecommerce1';

describe('HeaderEcommerce1', () => {
  let component: HeaderEcommerce1;
  let fixture: ComponentFixture<HeaderEcommerce1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderEcommerce1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderEcommerce1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
