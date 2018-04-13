import { async, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { Injectable, Injector } from '@angular/core';

import { ProductsService } from './products.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  XHRBackend,
  Response,
  Http,
  ResponseOptions,
  ConnectionBackend,
  RequestOptions,
  BaseRequestOptions
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Product } from '../models/product.model';
import { Ingredient } from '../models/ingredient.model';

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
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        ProductsService,
        { provide: XHRBackend, useClass: MockBackend }
      ]
    });
  });

  fit(
    'should be injectable',
    inject([ProductsService], (service: ProductsService) => {
      console.log('product service expected tobe truthy');
      expect(service).toBeTruthy();
    })
  );

  describe('all()', () => {
    fit(
      'should call the correct http endpoint',
      inject(
        [ProductsService, XHRBackend],
        (service: ProductsService, mockBackend: MockBackend) => {
          console.log('mockbackend.connections' + mockBackend.connections);
          mockBackend.connections.subscribe((conn: MockConnection) => {
            console.log('conn: ' + conn.readyState);
            this.lastConnection = conn;

            console.log('last connection: ' + this.lastConnection);

            expect(this.lastConnection.request.url).toEqual(
              './assets/product.json'
            );

            this.lastConnection.mockRespond(
              new Response(
                new ResponseOptions({
                  body: JSON.stringify(createProducts(2))
                })
              )
            );
          });

          service.all().subscribe(products => {
            console.log('service.all()');
            expect(1).toEqual(products.length);

            expect(products.length).toEqual(2);
            expect(products[0].id).toBe('0');
            expect(products[1].id).toBe('1');
            console.log('product.length: ' + products.length);
          });
        } ///
      )
    );
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
