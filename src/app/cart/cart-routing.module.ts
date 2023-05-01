import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { HistoryComponent } from './components/history/history.component';

const routes: Routes = [
  {
    path: '',
    component: CartDetailsComponent,
  },
  {
    path: 'history',
    component: HistoryComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartRoutingModule {}
