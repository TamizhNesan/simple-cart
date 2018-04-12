import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Product } from '../models/product.model';

@Injectable()
export class ProductsService {
  constructor(private http: HttpClient) {}
  public all(): Observable<Product[]> {
    return this.http.get<Product[]>('./assets/products.json').map(response =>
      response.map(item => {
        const model = new Product();
        model.updateFrom(item);
        return model;
      })
    );
  }
}
