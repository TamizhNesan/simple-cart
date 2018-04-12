import { TestBed, inject } from '@angular/core/testing';

import { DeliveryOptionsService } from './delivery-options.service';
import { HttpClient } from '@angular/common/http';
let httpClientSpy: { get: jasmine.Spy };

describe('DeliveryOptionsService', () => {
  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    TestBed.configureTestingModule({
      providers: [
        DeliveryOptionsService,
        {
          provide: HttpClient,
          useValue: httpClientSpy
        }
      ]
    });
  });

  it(
    'should be created',
    inject([DeliveryOptionsService], (service: DeliveryOptionsService) => {
      expect(service).toBeTruthy();
    })
  );
});
