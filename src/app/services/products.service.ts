import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Product } from '../models/product.model';
import { CachcingServiceBase } from './caching.service';

@Injectable()
export class ProductsService extends CachcingServiceBase {
  private products: Observable<Product[]>;
  constructor(private http: HttpClient) {
    super();
  }
  public all(): Observable<Product[]> {
    return this.cache<Product[]>(
      () => this.products,
      (val: Observable<Product[]>) => (this.products = val),
      () =>
        this.http.get<Product[]>('./assets/products.json').map(response =>
          response.map(item => {
            const model = new Product();
            model.updateFrom(item);
            return model;
          })
        )
    );
  }
}
