import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;

  private unSub$: Subject<boolean> = new Subject<boolean>();

  onLogout() {}

  ngOnInit() {}

  ngOnDestroy() {
    this.unSub$.next(true);
    this.unSub$.complete();
  }
}
