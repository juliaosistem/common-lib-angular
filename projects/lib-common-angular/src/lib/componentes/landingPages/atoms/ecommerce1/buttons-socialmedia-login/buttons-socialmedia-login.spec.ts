import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonsSocialmediaLogin } from './buttons-socialmedia-login';

describe('ButtonsSocialmediaLogin', () => {
  let component: ButtonsSocialmediaLogin;
  let fixture: ComponentFixture<ButtonsSocialmediaLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonsSocialmediaLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonsSocialmediaLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
