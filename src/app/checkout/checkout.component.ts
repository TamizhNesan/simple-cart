import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCart } from '../models/shopping-cart.model';
import { Observable } from 'rxjs/Observable';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { ProductsService } from '../services/products.service';
import { Subscription } from 'rxjs/Subscription';
import { DeliveryOptionsService } from '../services/delivery-options.service';
import { DeliveryOption } from '../models/delivery-option.model';

interface ICartItemWithProduct extends CartItem {
  product: Product;
  totalCost: number;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  public cart: Observable<ShoppingCart>;
  public cartItems: ICartItemWithProduct[];
  public itemCount: number;
  public deliveryOptions: Observable<DeliveryOption[]>;
  private products: Product[];
  private cartSubscription: Subscription;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private productsService: ProductsService,
    private deliveryOptionService: DeliveryOptionsService
  ) {}

  ngOnInit() {
    this.deliveryOptions = this.deliveryOptionService.all();

    this.cart = this.shoppingCartService.get();

    this.cartSubscription = this.cart.subscribe(cart => {
      this.itemCount = cart.items
        .map(x => x.quantity)
        .reduce((p, n) => p + n, 0);
      this.productsService.all().subscribe(products => {
        this.products = products;
        this.cartItems = cart.items.map(item => {
          const product = this.products.find(p => p.id === item.productId);
          return {
            ...item,
            product,
            totalCost: product.price * item.quantity
          };
        });
      });
    });
  }
  public setDeliveryOption(option: DeliveryOption): void {
    this.shoppingCartService.setDeliveryOption(option);
  }

  public ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
