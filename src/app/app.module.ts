import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { StoreFrontComponent } from './store-front/store-front.component';

import { ProductsService } from './services/products.service';
import { ShoppingCartService } from './services/shopping-cart.service';
import {
  StorageService,
  LocalStorageService
} from './services/storage.service';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { DeliveryOptionsService } from './services/delivery-options.service';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { PopulatedCartRouteGuard } from './route-guards/populated-cart-route.guard';

@NgModule({
  declarations: [
    AppComponent,
    StoreFrontComponent,
    ShoppingCartComponent,
    CheckoutComponent,
    OrderConfirmationComponent
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [
    ProductsService,
    ShoppingCartService,
    DeliveryOptionsService,
    PopulatedCartRouteGuard,
    LocalStorageService,
    { provide: StorageService, useClass: LocalStorageService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
