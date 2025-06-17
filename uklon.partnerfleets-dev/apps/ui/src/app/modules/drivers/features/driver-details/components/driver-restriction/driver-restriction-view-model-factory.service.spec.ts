import { TestBed } from '@angular/core/testing';

import { DriverRestrictionViewModelFactoryService } from './driver-restriction-view-model-factory.service';

describe('DriverRestrictionViewModelFactoryService', () => {
  let service: DriverRestrictionViewModelFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DriverRestrictionViewModelFactoryService],
    });
    service = TestBed.inject(DriverRestrictionViewModelFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
