import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContenidoNavComponent } from './contenido-nav.component';

describe('ContenidoNavComponent', () => {
  let component: ContenidoNavComponent;
  let fixture: ComponentFixture<ContenidoNavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ContenidoNavComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ContenidoNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
