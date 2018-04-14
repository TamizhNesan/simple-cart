import { TestBed, inject } from '@angular/core/testing';

import { DeliveryOptionsService } from './delivery-options.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  HttpModule,
  Response,
  ResponseOptions,
  XHRBackend
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { DeliveryOption } from '../models/delivery-option.model';
import { asyncData } from '../testing/async-observable-helpers';

describe('DeliveryOptionsService', () => {
  let httpClientSpy: { get: jasmine.Spy };
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

describe('DeliveryOptionsDataServive', () => {
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
  let deliveryOptionsService: DeliveryOptionsService;
  beforeEach(() => {
    deliveryOptionsService = new DeliveryOptionsService(<any>httpClientSpy);
  });

  // it(
  //   'should be injectable',
  //   inject([DeliveryOptionsService], (service: DeliveryOptionsService) => {
  //     expect(service).toBeTruthy();
  //   })
  // );

  describe('all()', () => {
    it('should return expected options', () => {
      httpClientSpy.get.and.returnValue(asyncData(createDeliveryOptions(2)));
      deliveryOptionsService.all().subscribe(options => {
        expect(options.length).toBe(2);
        expect(options[0].id).toBe('0');
        expect(options[1].id).toBe('1');
      });
    });
  });
});

function createDeliveryOptions(count: number): DeliveryOption[] {
  const options = new Array<DeliveryOption>();
  for (let i = 0; i < count; i += 1) {
    const option = new DeliveryOption();
    option.id = i.toString();
    option.name = `name ${i}`;
    option.description = `description ${i}`;
    option.price = i;
    options.push(option);
  }

  return options;
}
