import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { CredentialsService } from '../../../core/services/credentials.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;

  private unSub$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private authService: AuthService,
    private credentialsService: CredentialsService,
    private router: Router
  ) {}

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }

  ngOnInit() {
    this.isLoggedIn = this.credentialsService.isAuthenticated();
    this.authService
      .getAuthStatusListener()
      .pipe(takeUntil(this.unSub$))
      .subscribe({
        next: (isAuthenticated) => {
          this.isLoggedIn = isAuthenticated;
        },
      });
  }

  ngOnDestroy() {
    this.unSub$.next(true);
    this.unSub$.complete();
  }
}
