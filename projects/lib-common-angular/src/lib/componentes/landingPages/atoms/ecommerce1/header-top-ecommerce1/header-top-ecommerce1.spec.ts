import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderTopEcommerce1 } from './header-top-ecommerce1';

describe('HeaderTopEcommerce1', () => {
  let component: HeaderTopEcommerce1;
  let fixture: ComponentFixture<HeaderTopEcommerce1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderTopEcommerce1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderTopEcommerce1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
