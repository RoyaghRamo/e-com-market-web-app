import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {
  passwordPatternError,
  passwordRegex,
} from '../../../shared/models/auth.model';
import { RegisterResponse } from '../../../shared/models/http.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  registerFormErrors!: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    password: string | null;
    confirmPassword: string | null;
  };
  registeringError!: string;

  private unSub$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerFormErrors = {
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      confirmPassword: null,
    };
  }

  get formControlFirstName() {
    return this.registerForm.controls['firstName'];
  }

  get formControlLastName() {
    return this.registerForm.controls['lastName'];
  }

  get formControlEmail() {
    return this.registerForm.controls['email'];
  }

  get formControlPassword() {
    return this.registerForm.controls['password'];
  }

  get formControlConfirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }

  onRegister() {
    if (this.registerForm.pristine) {
      this.registerFormErrors = {
        firstName: 'First Name is required',
        lastName: 'Last Name is required',
        email: 'Email is required',
        password: 'Password is required',
        confirmPassword: 'Confirm Password is required',
      };
    } else if (!this.registerForm.valid) {
      if (this.registerForm.errors) {
        console.log('errors', this.registerForm);
        this.registeringError = 'Registration Form is invalid!\n';
      }
    } else {
      this.authService
        .register({
          ...this.registerForm.value,
        })
        .pipe(takeUntil(this.unSub$))
        .subscribe({
          next: async (res: RegisterResponse) => {
            console.log('res', res);
            if (res.success) {
              await this.router.navigateByUrl('/auth/login');
            } else {
              this.registeringError = 'Unknown error occurred!';
            }
          },
          error: (errorRes: any) => {
            console.log('errorRes', errorRes);
            if (errorRes.error.errors.length > 0) {
              this.registeringError = errorRes.error.errors.join('\n');
            }
          },
        });
    }
  }

  ngOnInit() {
    this.createRegisterForm();

    this.registerForm.valueChanges
      .pipe(takeUntil(this.unSub$))
      .subscribe((value) => {
        // console.log(this.registerForm.controls);
        Object.keys(this.registerForm.controls).forEach((key: string) => {
          let keyErrors = this.registerForm.controls[key].errors;
          switch (key) {
            case 'firstName':
              if (keyErrors) {
                let firstNameErrorKeys = Object.keys(keyErrors);
                switch (firstNameErrorKeys[0]) {
                  case 'required':
                    this.registerFormErrors.firstName = 'FirstName is required';
                    break;
                  case 'minlength':
                    this.registerFormErrors.firstName =
                      'FirstName must be longer than 3 characters';
                    break;
                  default:
                    this.registerFormErrors.firstName = null;
                    break;
                }
              } else {
                this.registerFormErrors.firstName = null;
              }
              break;
            case 'lastName':
              if (keyErrors) {
                let lastNameErrorKeys = Object.keys(keyErrors);
                switch (lastNameErrorKeys[0]) {
                  case 'required':
                    this.registerFormErrors.lastName = 'LastName is required';
                    break;
                  case 'minlength':
                    this.registerFormErrors.lastName =
                      'lastName must be longer than 3 characters';
                    break;
                  default:
                    this.registerFormErrors.lastName = null;
                    break;
                }
              } else {
                this.registerFormErrors.lastName = null;
              }
              break;
            case 'email':
              if (keyErrors) {
                let emailErrorKeys = Object.keys(keyErrors);
                switch (emailErrorKeys[0]) {
                  case 'required':
                    this.registerFormErrors.email = 'Email is required';
                    break;
                  case 'email':
                    this.registerFormErrors.email = 'Invalid Email';
                    break;
                  default:
                    this.registerFormErrors.email = null;
                    break;
                }
              } else {
                this.registerFormErrors.email = null;
              }
              break;
            case 'password':
              if (keyErrors) {
                let passwordErrorKeys = Object.keys(keyErrors);
                switch (passwordErrorKeys[0]) {
                  case 'required':
                    this.registerFormErrors.password = 'Password is required';
                    break;
                  case 'pattern':
                    this.registerFormErrors.password = passwordPatternError;
                    break;
                  default:
                    this.registerFormErrors.password = null;
                    break;
                }
              } else {
                this.registerFormErrors.password = null;
              }
              break;
            case 'confirmPassword':
              if (keyErrors) {
                let confirmPasswordErrorKeys = Object.keys(keyErrors);
                switch (confirmPasswordErrorKeys[0]) {
                  case 'required':
                    this.registerFormErrors.confirmPassword =
                      'Confirm Password is required';
                    break;
                  case 'pattern':
                    this.registerFormErrors.confirmPassword =
                      passwordPatternError;
                    break;
                  default:
                    this.registerFormErrors.confirmPassword = null;
                    break;
                }
              } else {
                this.registerFormErrors.confirmPassword = null;
              }

              if (
                this.registerForm.controls['password'].value &&
                this.registerForm.controls['confirmPassword'].value &&
                this.registerForm.controls['password'].value !=
                  this.registerForm.controls['confirmPassword'].value
              ) {
                this.registerFormErrors.confirmPassword =
                  "Password doesn't match";
              }

              break;
            default:
              break;
          }
        });
      });
  }

  ngOnDestroy() {
    this.unSub$.next(true);
    this.unSub$.complete();
  }

  private createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      firstName: this.formBuilder.control(
        '',
        Validators.compose([Validators.required, Validators.minLength(3)])
      ),
      lastName: this.formBuilder.control(
        '',
        Validators.compose([Validators.required, Validators.minLength(3)])
      ),
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
      confirmPassword: this.formBuilder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(passwordRegex),
        ])
      ),
    });
  }
}
