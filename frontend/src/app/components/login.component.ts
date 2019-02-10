import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-login',
  template: `
    <form class="panel mid-center" [formGroup]="form" (ngSubmit)="submit()">
      <mat-toolbar color="primary">Administrative Login</mat-toolbar>
      <mat-progress-bar mode="indeterminate" *ngIf="loading>0"></mat-progress-bar>
      <div class="panel-content">
        <mat-form-field>
          <input matInput required placeholder="Username" [formControl]="username" name="username">
          <mat-error *ngIf="username.invalid">Username is required</mat-error>
        </mat-form-field>
        <mat-form-field>
          <input matInput required placeholder="Password" [formControl]="password" name="password" type="password"
                 autocomplete="off">
          <mat-error *ngIf="password.invalid">Password is required</mat-error>
        </mat-form-field>
      </div>
      <div class="panel-footer of-hidden">
        <button mat-flat-button type="button">I forgot my password</button>
        <button [disabled]="loading > 0 || form.invalid" type="submit" mat-raised-button class="float-right"
                color="primary">LOGIN
        </button>
      </div>
    </form>
  `,
  styles: []
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  loading = 0;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private sb: MatSnackBar) {
    this.form = fb.group({
      username: fb.control('', Validators.required),
      password: fb.control('', Validators.required),
    });
  }

  get username() {
    return this.form.get('username');
  }

  get password() {
    return this.form.get('password');
  }


  ngOnInit() {
  }

  submit() {
    this.loading++;
    this.auth.loginAdmin(this.form.value).subscribe(res => {
      console.log(this.auth.user);
      setTimeout(() => {
        this.loading--;
        switch (this.auth.user.type) {
          case 'chairman':
            this.router.navigate(['dept-chairman']);
            break;
          case 'office':
            this.router.navigate(['dept-office']);
            break;
          case 'provost':
            this.router.navigate(['hall-provost']);
            break;
          case 'bank':
            this.router.navigate(['bank']);
            break;
          case 'accounts':
            this.router.navigate(['accounts']);
            break;
          default:
            this.sb.open('Admin role does not exists.', 'OK', { duration: 4000 });
        }
      }, 300);
    }, error => {
      this.loading--;
      this.sb.open('Login failed.', 'OK', { duration: 4000 });
    });
  }
}
