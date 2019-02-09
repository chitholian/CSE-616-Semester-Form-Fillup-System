import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Department, Semester} from '../custom/interfaces';
import {DepartmentService} from '../services/department.service';
import {MatSnackBar} from '@angular/material';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-student-login',
  template: `
    <form class="panel mid-center" [formGroup]="form" (ngSubmit)="submit()">
      <mat-toolbar color="primary">Student Login</mat-toolbar>
      <div class="panel-content of-hidden">
        <mat-form-field>
          <input matInput required type="number" placeholder="Student ID" [formControl]="id" name="id">
          <mat-error *ngIf="id.invalid">A valid Student ID is required</mat-error>
        </mat-form-field>
        <mat-form-field>
          <mat-select [formControl]="department" required placeholder="Department" (selectionChange)="loadSemesters($event.value)">
            <mat-option *ngFor="let d of departments" [value]="d.id">{{d.name}}</mat-option>
          </mat-select>
          <mat-error *ngIf="department.invalid">A department is required</mat-error>
        </mat-form-field>
        <mat-form-field>
          <mat-select [disabled]="loading || department.invalid" [formControl]="semester" required placeholder="Semester">
            <mat-option *ngFor="let s of semesters" [value]="s.id">Semester {{s.number}}, Year {{s.year}}</mat-option>
          </mat-select>
          <mat-error *ngIf="semester.invalid">A semester is required</mat-error>
        </mat-form-field>
        <button mat-raised-button type="submit" color="primary" class="float-right">LOGIN</button>
      </div>
    </form>
  `,
  styles: []
})
export class StudentLoginComponent implements OnInit {
  form: FormGroup;

  loading = 0;

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

  constructor(private router: Router, private auth: AuthService, private fb: FormBuilder, private ds: DepartmentService, private snackBar: MatSnackBar) {
    this.form = fb.group({
      id: fb.control('', Validators.pattern(/^[1-9]\d{7}$/)),
      department: fb.control('', Validators.required),
      semester: fb.control('', Validators.required),
    });
  }

  ngOnInit() {
    this.loading++;
    this.ds.getAllDepartments().subscribe(data => {
      this.departments = data;
      this.loading--;
    }, error => {
      this.snackBar.open('Error fetching departments');
      this.loading--;
    });
  }

  submit() {
    this.loading++;
    this.auth.loginStudent(this.form.value).subscribe(
      res => {
        if (this.department.value === res.department && this.semester.value === res.semester) {
          this.router.navigate(['/student']);
        } else {
          this.snackBar.open('Login failed.', 'OK');
        }
        this.loading--;
      },
      error1 => {
        this.loading--;
        this.snackBar.open('Login failed.', 'OK');
      }
    );
  }

  loadSemesters(departmentId) {
    this.loading++;

    this.ds.getSemesters(departmentId).subscribe(
      data => {
        this.semesters = data;
        this.loading--;

      }, error => {
        this.loading--;
      });
  }
}
