import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { HistoryComponent } from './components/history/history.component';
import { FormsModule } from '@angular/forms';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';

@NgModule({
  declarations: [HistoryComponent, CartDetailsComponent],
  imports: [CommonModule, CartRoutingModule, DecimalPipe, FormsModule],
})
export class CartModule {}
