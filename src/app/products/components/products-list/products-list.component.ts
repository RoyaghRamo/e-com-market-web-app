import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import {
  cartOrdersKey,
  Category,
  Product,
} from '../../../shared/models/product.model';
import { CartOrder } from '../../../shared/models/order.model';
import { Subject, takeUntil } from 'rxjs';
import { FetchResponse } from '../../../shared/models/http.model';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  products: Product[] = [];
  categories: Category[] = [];
  cartOrders: CartOrder[] = [];

  private unSub$: Subject<boolean> = new Subject<boolean>();

  constructor(private productsService: ProductsService) {}

  onSelectedCategory(selectedCategoryId: number) {
    this.getProductsByCategoryId(selectedCategoryId);
  }

  getProductsByCategoryId(selectedCategoryId: number) {
    const filter =
      selectedCategoryId > 0 ? `categoryId=${selectedCategoryId}` : '';
    this.loadProducts(filter);
  }

  loadProducts(filter: string) {
    this.loading = true;
    this.productsService
      .getAllProducts({ filter })
      .pipe(takeUntil(this.unSub$))
      .subscribe({
        next: (res: FetchResponse<Product>) => {
          console.log('getProducts res', res);
          this.products = res.docs;
          this.loading = false;
        },
        error: (errorRes) => {
          console.log('getProducts errorRes', errorRes);
          this.loading = false;
        },
      });
  }

  loadCategories() {
    this.productsService
      .getAllCategories()
      .pipe(takeUntil(this.unSub$))
      .subscribe({
        next: (res: FetchResponse<Category>) => {
          console.log('getCategories: res', res);
          this.categories = res.docs;
          this.loading = false;
        },
        error: (errorRes) => {
          console.log('errorRes', errorRes);
          this.loading = false;
          // alert(errorRes);
        },
      });
  }

  addToCart(data: { item: Product; quantity: number }) {
    const maxQuantity = data.item.quantity;
    this.cartOrders =
      JSON.parse(localStorage.getItem(cartOrdersKey) || '[]') || [];

    let foundOrderIndex: number = 0;
    foundOrderIndex = this.cartOrders.findIndex(
      (o) => o.product.id == data.item.id
    );
    if (foundOrderIndex == -1) {
      this.cartOrders.push({
        productId: data.item.id,
        id: 0,
        product: data.item,
        quantity: data.quantity,
        paid: false,
      });
    } else {
      if (
        this.cartOrders[foundOrderIndex].quantity + data.quantity >
        maxQuantity
      ) {
        alert('Insufficient Product Quantity');
      } else {
        this.cartOrders[foundOrderIndex].quantity += data.quantity;
      }
    }

    localStorage.setItem(cartOrdersKey, JSON.stringify(this.cartOrders));
  }

  ngOnInit() {
    this.loadCategories();
    this.loadProducts('');
  }

  ngOnDestroy() {
    this.unSub$.next(true);
    this.unSub$.complete();
  }
}
