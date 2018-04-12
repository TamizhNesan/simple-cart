import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Product } from '../models/product.model';
import { ShoppingCart } from '../models/shopping-cart.model';
import { Subscription } from 'rxjs/Subscription';
import { ProductsService } from '../services/products.service';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  public products: Observable<Product[]>;
  public cart: Observable<ShoppingCart>;
  public itemCount: number;

  private cartSubsription: Subscription;

  constructor(
    private productsService: ProductsService,
    private shoppingCartService: ShoppingCartService
  ) {}

  ngOnInit() {
    this.products = this.productsService.all();
    this.cart = this.shoppingCartService.get();
    this.cartSubsription = this.cart.subscribe(cart => {
      this.itemCount = cart.items
        .map(x => x.quantity)
        .reduce((p, n) => p + n, 0);
    });
  }
  ngOnDestroy(): void {
    if (this.cartSubsription) {
      this.cartSubsription.unsubscribe();
    }
  }

  public emptyCart(): void {
    this.shoppingCartService.empty();
  }
}
