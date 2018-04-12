import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreFrontComponent } from './store-front/store-front.component';

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot([
      {
        path: '**',
        component: StoreFrontComponent
      }
    ])
  ],
  declarations: []
})
export class AppRoutingModule {}
