import { TestBed, inject } from '@angular/core/testing';

import { ProductsService } from './products.service';
import { HttpClient } from '@angular/common/http';
let httpClientSpy: { get: jasmine.Spy };
describe('ProductsService', () => {
  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    TestBed.configureTestingModule({
      providers: [
        ProductsService,
        {
          provide: HttpClient,
          useValue: httpClientSpy
        }
      ]
    });
  });

  it(
    'should be created',
    inject([ProductsService], (service: ProductsService) => {
      expect(service).toBeTruthy();
    })
  );
});
