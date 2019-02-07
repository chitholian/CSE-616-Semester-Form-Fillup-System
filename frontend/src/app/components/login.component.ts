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
      <div class="panel-content">
        <mat-form-field>
          <mat-select [formControl]="type" required placeholder="Administrator Type">
            <mat-option *ngFor="let t of types" [value]="t.val">{{t.name}}</mat-option>
          </mat-select>
          <mat-error *ngIf="type.invalid">A type is required</mat-error>
        </mat-form-field>
        <mat-form-field>
          <input matInput required placeholder="Username" [formControl]="username" name="username">
          <mat-error *ngIf="username.invalid">Username is required</mat-error>
        </mat-form-field>
        <mat-form-field>
          <input matInput required placeholder="Password" [formControl]="password" name="password" type="password" autocomplete="off">
          <mat-error *ngIf="password.invalid">Password is required</mat-error>
        </mat-form-field>
      </div>
      <div class="panel-footer of-hidden">
        <button mat-flat-button type="button">I forgot my password</button>
        <button [disabled]="loading > 0 || form.invalid" type="submit" mat-raised-button class="float-right" color="primary">LOGIN</button>
      </div>
    </form>
  `,
  styles: []
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  loading = 0;
  types = [
    {val: 'chairman', name: 'Department Chairman'},
    {val: 'office', name: 'Department Office'},
    {val: 'accounts', name: 'Accounts Section'},
    {val: 'bank', name: 'Bank Section'},
    {val: 'provost', name: 'Hall Provost'},
  ];

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private sb: MatSnackBar) {
    this.form = fb.group({
      type: fb.control('', Validators.required),
      username: fb.control('', Validators.required),
      password: fb.control('', Validators.required),
    });
  }

  get type() {
    return this.form.get('type');
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
    this.auth.loginAdmin(this.form.value).subscribe(
      res => {
        console.log(res);
        this.router.navigate(['/dept-chairman/']);
      }, error1 => {
        console.log(error1);
        this.loading--;
        this.sb.open('Login failed.');
      });
  }
}
