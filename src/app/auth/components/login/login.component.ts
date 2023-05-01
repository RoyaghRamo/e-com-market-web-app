import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {
  passwordPatternError,
  passwordRegex,
} from '../../../shared/models/auth.model';
import { LoginResponse } from '../../../shared/models/http.model';
import { CredentialsService } from '../../../core/services/credentials.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loginFormErrors!: {
    email: string | null;
    password: string | null;
  };
  loginError!: string;

  private unSub$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private credentialsService: CredentialsService,
    private router: Router
  ) {
    this.loginFormErrors = {
      email: null,
      password: null,
    };
  }

  get formControlEmail() {
    return this.loginForm.controls['email'];
  }

  get formControlPassword() {
    return this.loginForm.controls['password'];
  }

  ngOnInit() {
    this.createLoginForm();

    this.loginForm.valueChanges
      .pipe(takeUntil(this.unSub$))
      .subscribe((value) => {
        // console.log('this.loginForm.controls', this.loginForm.controls);
        Object.keys(this.loginForm.controls).forEach((key: string) => {
          let keyErrors = this.loginForm.controls[key].errors;
          switch (key) {
            case 'email':
              if (keyErrors) {
                let emailErrorKeys = Object.keys(keyErrors);
                switch (emailErrorKeys[0]) {
                  case 'required':
                    this.loginFormErrors.email = 'Email is required';
                    break;
                  case 'email':
                    this.loginFormErrors.email = 'Invalid Email';
                    break;
                  default:
                    this.loginFormErrors.email = null;
                    break;
                }
              } else {
                this.loginFormErrors.email = null;
              }
              break;
            case 'password':
              if (keyErrors) {
                let passwordErrorKeys = Object.keys(keyErrors);
                switch (passwordErrorKeys[0]) {
                  case 'required':
                    this.loginFormErrors.password = 'Password is required';
                    break;
                  case 'pattern':
                    this.loginFormErrors.password = passwordPatternError;
                    break;
                  default:
                    this.loginFormErrors.password = null;
                    break;
                }
              } else {
                this.loginFormErrors.password = null;
              }
              break;
            default:
              break;
          }
        });
      });
  }

  onLogin() {
    if (this.loginForm.pristine) {
      this.loginFormErrors = {
        email: 'Email is required',
        password: 'Password is required',
      };
    } else if (!this.loginForm.valid) {
      if (this.loginForm.errors) {
        console.log('errors', this.loginForm);
        this.loginError = 'Login Form is invalid!\n';
      }
    } else {
      this.authService
        .login(this.loginForm.value)
        .pipe(takeUntil(this.unSub$))
        .subscribe({
          next: async (res: LoginResponse) => {
            console.log('res', res);
            if (res.errors.length > 0) {
              this.loginError = res.errors.join('\n');
            } else if (res.success) {
              this.credentialsService.setCredentials(
                { token: res.token, userId: res.userId },
                true
              );
              this.authService.setAuthenticated(true);
              await this.router.navigateByUrl('/products');
            } else {
              this.loginError = 'Unknown error occurred!';
            }
          },
          error: (errorRes: any) => {
            console.log('errorRes', errorRes);
            if (errorRes.error.errors.length > 0) {
              this.loginError = errorRes.error.errors.join('\n');
            }
          },
        });
    }
  }

  ngOnDestroy() {
    this.unSub$.next(true);
    this.unSub$.complete();
  }

  private createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: this.formBuilder.control(
        '',
        Validators.compose([Validators.required, Validators.email])
      ),
      password: this.formBuilder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(passwordRegex),
        ])
      ),
    });
  }
}
