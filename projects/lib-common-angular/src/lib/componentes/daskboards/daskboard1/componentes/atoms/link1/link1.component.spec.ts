import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { Link1Component } from './link1.component';

describe('Link1Component', () => {
  let component: Link1Component;
  let fixture: ComponentFixture<Link1Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [Link1Component],
      providers: [provideRouter([]), ...provideTranslateService()]
    }).compileComponents();

    fixture = TestBed.createComponent(Link1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
