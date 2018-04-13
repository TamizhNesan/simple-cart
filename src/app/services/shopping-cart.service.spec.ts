import { TestBed, inject } from '@angular/core/testing';

import { ShoppingCartService } from './shopping-cart.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { ProductsService } from './products.service';
import { DeliveryOptionsService } from './delivery-options.service';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs/Observable';
import { asyncData } from '../testing/async-observable-helpers';
import { DeliveryOption } from '../models/delivery-option.model';
let httpClientSpy: { get: jasmine.Spy };
const StorageServiceSpy = jasmine.createSpyObj('StorageService', [
  'cache',
  'get'
]);
const productsServiceSpy = jasmine.createSpyObj('ProductsService', ['all']);
const deliveryOptionsServiceSpy = jasmine.createSpyObj(
  'DeliveryOptionsService',
  ['all']
);

describe('ShoppingCartService', () => {
  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    const testProducts: Product[] = [];
    const fakeDeliveryOptions: DeliveryOption[] = [];
    deliveryOptionsServiceSpy.all.and.returnValue(
      asyncData(fakeDeliveryOptions)
    );

    productsServiceSpy.all.and.returnValue(asyncData(testProducts));
    TestBed.configureTestingModule({
      providers: [
        { provide: ProductsService, useValue: productsServiceSpy },
        ShoppingCartService,
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: StorageService,
          useValue: StorageServiceSpy
        },
        {
          provide: DeliveryOptionsService,
          useValue: deliveryOptionsServiceSpy
        }
      ]
    });
  });

  it(
    'should be created',
    inject([ShoppingCartService], (service: ShoppingCartService) => {
      expect(service).toBeTruthy();
    })
  );
});
