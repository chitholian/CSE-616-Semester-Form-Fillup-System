import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Department, Semester} from '../custom/interfaces';
import {DepartmentService} from '../services/department.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-student-login',
  template: `
    <form class="panel mid-center" [formGroup]="form" (ngSubmit)="submit()">
      <mat-toolbar color="primary">Student Login</mat-toolbar>
      <div class="panel-content of-hidden">
        <mat-form-field>
          <input matInput required type="number" placeholder="Student ID" [formControl]="id" name="id">
          <mat-error *ngIf="id.hasError('required') || id.hasError('pattern')">A valid Student ID is required</mat-error>
        </mat-form-field>
        <mat-form-field>
          <mat-select [formControl]="department" required placeholder="Department" (selectionChange)="loadSemesters($event.value)">
            <mat-option *ngFor="let d of departments" [value]="d.id">{{d.name}}</mat-option>
          </mat-select>
          <mat-error *ngIf="department.hasError('required')">A department is required</mat-error>
        </mat-form-field>
        <mat-form-field>
          <mat-select [disabled]="loading || department.invalid" [formControl]="semester" required placeholder="Semester">
            <mat-option *ngFor="let s of semesters" [value]="s.id">Semester {{s.number}}, Year {{s.year}}</mat-option>
          </mat-select>
          <mat-error *ngIf="semester.hasError('required')">A semester is required</mat-error>
        </mat-form-field>
        <button mat-flat-button type="button" routerLink="/registration">I am a new student</button>
        <button mat-raised-button type="submit" color="primary" class="float-right" [disabled]="loading || form.invalid">LOGIN</button>
      </div>
    </form>
  `,
  styles: []
})
export class StudentLoginComponent implements OnInit {
  form: FormGroup;

  loading = false;

  departments: Department[];
  semesters: Semester[];

  get id() {
    return this.form.get('id');
  }

  get semester() {
    return this.form.get('semester');
  }

  get department() {
    return this.form.get('department');
  }

  constructor(private fb: FormBuilder, private ds: DepartmentService, private snackBar: MatSnackBar) {
    this.form = fb.group({
      id: fb.control('', Validators.pattern(/^[1-9]\d{7}$/)),
      department: fb.control('', Validators.required),
      semester: fb.control('', Validators.required),
    });
  }

  ngOnInit() {
    this.loading = true;
    this.ds.getAllDepartments().subscribe(data => {
      this.departments = data;
      this.loading = false;
    }, error => {
      this.snackBar.open('Error fetching departments');
      this.loading = false;
    });
  }

  submit() {
  }

  loadSemesters(departmentId) {
    this.loading = true;

    this.ds.getSemesters(departmentId).subscribe(
      data => {
        this.semesters = data;
        this.loading = false;

      }, error => {
        this.loading = false;
      });
  }
}
