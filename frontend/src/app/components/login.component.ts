import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  template: `
    <form class="panel mid-center" [formGroup]="form" (ngSubmit)="submit()">
      <mat-toolbar color="primary">Administrative Login</mat-toolbar>
      <div class="panel-content">
        <mat-form-field>
          <mat-select [formControl]="adminType" required placeholder="Administrator Type">
            <mat-option *ngFor="let t of adminTypes" value="t.val">{{t.name}}</mat-option>
          </mat-select>
          <mat-error *ngIf="adminType.hasError('required')">A type is required</mat-error>
        </mat-form-field>
        <mat-form-field>
          <input matInput required placeholder="Username" [formControl]="username" name="username">
          <mat-error *ngIf="username.hasError('required')">Username is required</mat-error>
        </mat-form-field>
        <mat-form-field>
          <input matInput required placeholder="Password" [formControl]="password" name="password" type="password" autocomplete="off">
          <mat-error *ngIf="password.hasError('required')">Password is required</mat-error>
        </mat-form-field>
      </div>
      <div class="panel-footer of-hidden">
        <button mat-flat-button type="button">I forgot my password</button>
        <button [disabled]="loading || form.invalid" type="submit" mat-raised-button class="float-right" color="primary">LOGIN</button>
      </div>
    </form>
  `,
  styles: []
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  loading = false;
  adminTypes = [
    {val: 'chairman', name: 'Department Chairman'},
    {val: 'office', name: 'Department Office'},
    {val: 'accounts', name: 'Accounts Section'},
    {val: 'bank', name: 'Bank Section'},
    {val: 'provost', name: 'Hall Provost'},
  ];

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      adminType: fb.control('', Validators.required),
      username: fb.control('', Validators.required),
      password: fb.control('', Validators.required),
    });
  }

  get adminType() {
    return this.form.get('adminType');
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
  }
}
