import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ProductsListComponent,
    ProductCardComponent,
    ProductDetailsComponent,
  ],
  imports: [CommonModule, ProductsRoutingModule, FormsModule, SharedModule],
})
export class ProductsModule {}
