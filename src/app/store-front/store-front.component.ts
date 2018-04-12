import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Product } from '../models/product.model';
import { ShoppingCart } from '../models/shopping-cart.model';
import { ProductsService } from '../services/products.service';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-store-front',
  templateUrl: './store-front.component.html',
  styleUrls: ['./store-front.component.scss']
})
export class StoreFrontComponent implements OnInit {
  public products: Observable<Product[]>;

  constructor(
    private productsService: ProductsService,
    private shoppingCartService: ShoppingCartService
  ) {}

  ngOnInit() {
    this.products = this.productsService.all();
  }

  public addProductToCart(product: Product): void {
    console.log(`addProductToCart is called with ${product.name} `);
    this.shoppingCartService.addItem(product, 1);
    console.log(`{{product.name}} added to the cart.`);
  }
  public removeProductFromCart(product: Product): void {
    this.shoppingCartService.addItem(product, -1);
  }

  public productInCart(product: Product): boolean {
    return Observable.create((obs: Observer<boolean>) => {
      const sub = this.shoppingCartService.get().subscribe(cart => {
        obs.next(cart.items.some(i => i.productId === product.id));
        obs.complete();
      });
      sub.unsubscribe();
    });
  }
}
