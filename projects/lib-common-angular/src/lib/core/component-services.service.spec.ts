import { TestBed } from '@angular/core/testing';

import { ComponentServicesService } from './component-services.service';

describe('ComponentServicesService', () => {
  let service: ComponentServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
