import { async, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { Injectable, Injector } from '@angular/core';

import { ProductsService } from './products.service';
import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse
} from '@angular/common/http';
import {
  XHRBackend,
  Response,
  Http,
  HttpModule,
  ResponseOptions,
  ConnectionBackend,
  RequestOptions,
  BaseRequestOptions
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Product } from '../models/product.model';
import { Ingredient } from '../models/ingredient.model';
import { asyncData, asyncError } from '../testing/async-observable-helpers';

describe('ProductsService', () => {
  let httpClientSpy: { get: jasmine.Spy };
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

describe('ProductsService', () => {
  let httpClientSpy: { get: jasmine.Spy };

  let service: ProductsService;
  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    service = new ProductsService(<any>httpClientSpy);
  });

  describe('all()', () => {
    it('should return expected products, httpclient called once', () => {
      httpClientSpy.get.and.returnValue(asyncData(createProducts(2)));

      service.all().subscribe(products => {
        expect(products.length).toEqual(2, 'product count : 2');
        expect(products[0].id).toBe('0', 'first product id : 0');
        expect(products[1].id).toBe('1', 'seccond product Id: 1');
        console.log('product.length: ' + products.length);

        expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
      });
    });

    it('should return an error when the server returns a 404', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404,
        statusText: 'Not Found'
      });

      httpClientSpy.get.and.returnValue(asyncError(errorResponse));

      service
        .all()
        .subscribe(
          products => fail('expected an error, not products'),
          error => expect(error.message).toContain('404 Not Found')
        );
    });
  });
});

function createProducts(count: number): Product[] {
  const products = new Array<Product>();
  for (let i = 0; i < count; i += 1) {
    const product = new Product();
    product.id = i.toString();
    (product.name = `name ${i}`),
      (product.price = i),
      (product.ingredients = new Array<Ingredient>());
    products.push(product);
  }
  return products;
}
