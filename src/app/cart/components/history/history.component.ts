import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartOrder } from '../../../shared/models/order.model';
import { Subject, takeUntil } from 'rxjs';
import { ProductsService } from '../../../products/services/products.service';
import { AuthService } from '../../../auth/services/auth.service';
import { CredentialsService } from '../../../core/services/credentials.service';
import { CartsService } from '../../services/carts.service';
import { FetchResponse } from '../../../shared/models/http.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit, OnDestroy {
  cartOrders: CartOrder[] = [];

  private unSub$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private productsService: ProductsService,
    private authService: AuthService,
    private credentialsService: CredentialsService,
    private cartsService: CartsService
  ) {}

  loadOrders() {
    this.cartsService
      .getOrders({ filter: 'paid=1' })
      .pipe(takeUntil(this.unSub$))
      .subscribe({
        next: (res: FetchResponse<CartOrder>) => {
          console.log('res', res);
          this.cartOrders = res.docs;
        },
      });
  }

  ngOnInit() {
    this.loadOrders();
  }

  ngOnDestroy() {
    this.unSub$.next(true);
    this.unSub$.complete();
  }
}
