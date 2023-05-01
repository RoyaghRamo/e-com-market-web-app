import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Subject, takeUntil } from 'rxjs';
import { FetchResponse } from '../../../shared/models/http.model';
import { Category, Product } from '../../../shared/models/product.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  id: number = 0;
  product: Product | undefined;
  category!: Category | undefined;
  loading: boolean = false;

  private unSub$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) {}

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.loadProduct();
  }

  loadProduct() {
    this.loading = true;
    this.productsService
      .getProductById(this.id)
      .pipe(takeUntil(this.unSub$))
      .subscribe({
        next: (res: FetchResponse<Product>) => {
          this.product = res.docs[0] || null;
          if (this.product) {
            this.productsService
              .getCategoryById(this.product.categoryId)
              .pipe(takeUntil(this.unSub$))
              .subscribe({
                next: (res: FetchResponse<Category>) => {
                  if (res.docs.length == 1) this.category = res.docs[0];
                  this.loading = false;
                },
                error: (errorRes) => {
                  console.log('errorRes', errorRes);
                  this.loading = false;
                  // alert(errorRes);
                },
              });
          }
        },
        error: (errorRes) => {
          console.log('errorRes', errorRes);
          this.loading = false;
          // alert(errorRes);
        },
      });
  }

  ngOnDestroy() {
    this.unSub$.next(true);
    this.unSub$.complete();
  }
}
