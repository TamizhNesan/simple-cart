import { TestBed, inject } from '@angular/core/testing';

import { DeliveryOptionsService } from './delivery-options.service';

describe('DeliveryOptionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeliveryOptionsService]
    });
  });

  it('should be created', inject([DeliveryOptionsService], (service: DeliveryOptionsService) => {
    expect(service).toBeTruthy();
  }));
});
