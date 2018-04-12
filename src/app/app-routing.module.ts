import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreFrontComponent } from './store-front/store-front.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { PopulatedCartRouteGuard } from './route-guards/populated-cart-route.guard';

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot([
      {
        canActivate: [PopulatedCartRouteGuard],
        path: 'checkout',
        component: CheckoutComponent
      },
      {
        canActivate: [PopulatedCartRouteGuard],
        path: 'confirmed',
        component: OrderConfirmationComponent
      },
      {
        path: '**',
        component: StoreFrontComponent
      }
    ])
  ],
  declarations: []
})
export class AppRoutingModule {}
