import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Department, Hall, Semester, Student} from '../custom/interfaces';
import {DepartmentService} from '../services/department.service';
import {MatSnackBar} from '@angular/material';
import {StudentService} from '../services/student.service';
import {Router} from '@angular/router';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-student-reg',
  template: `
    <form class="panel" [formGroup]="form" (ngSubmit)="submit()">
      <mat-toolbar color="primary">Student Registration</mat-toolbar>
      <div class="panel-content of-hidden">
        <div class="col-1-2">
          <mat-form-field>
            <input matInput required type="number" placeholder="Student ID" [formControl]="id" name="id">
            <mat-error *ngIf="id.invalid">A valid Student ID is required</mat-error>
          </mat-form-field>
          <mat-form-field>
            <input matInput required placeholder="Full Name" [formControl]="name" name="name">
            <mat-error *ngIf="name.invalid">A valid Name is required</mat-error>
          </mat-form-field>
          <mat-form-field>
            <mat-select [formControl]="gender" required placeholder="Gender">
              <mat-option *ngFor="let s of genders" [value]="s">{{s|titlecase}}</mat-option>
            </mat-select>
            <mat-error *ngIf="gender.invalid">Gender is required</mat-error>
          </mat-form-field>
          <mat-form-field>
            <mat-select [formControl]="department" required placeholder="Department" (selectionChange)="onDeptChange()">
              <mat-option *ngFor="let d of departments" [value]="d.id">{{d.name}}</mat-option>
            </mat-select>
            <mat-error *ngIf="department.invalid">A department is required</mat-error>
          </mat-form-field>
          <mat-form-field>
            <mat-select [disabled]="loading > 0 || department.invalid" [formControl]="semester" required placeholder="Semester">
              <mat-option *ngFor="let s of semesters" [value]="s.id">Semester {{s.number}}, Year {{s.year}}</mat-option>
            </mat-select>
            <mat-error *ngIf="semester.invalid">A semester is required</mat-error>
          </mat-form-field>
          <mat-form-field>
            <mat-select [disabled]="loading > 0 || department.invalid || gender.invalid" [formControl]="hall" required placeholder="Hall">
              <ng-container *ngFor="let s of halls">
                <mat-option *ngIf="s.gender == gender.value" [value]="s.id">{{s.name}}</mat-option>
              </ng-container>
            </mat-select>
            <mat-error *ngIf="hall.invalid">Hall is required</mat-error>
          </mat-form-field>
        </div>
        <div class="col-1-2">
          <mat-form-field>
            <mat-select [formControl]="religion" required placeholder="Religion">
              <mat-option *ngFor="let s of religions" [value]="s">{{s|titlecase}}</mat-option>
            </mat-select>
            <mat-error *ngIf="religion.invalid">Religion is required</mat-error>
          </mat-form-field>
          <mat-form-field>
            <mat-select [formControl]="session" required placeholder="Session">
              <mat-option *ngFor="let s of sessions" [value]="s">{{s}}</mat-option>
            </mat-select>
            <mat-error *ngIf="session.invalid">Session is required</mat-error>
          </mat-form-field>
          <mat-form-field>
            <input type="email" [formControl]="email" required matInput placeholder="Email" name="email">
            <mat-error *ngIf="email.invalid">A valid email address is required</mat-error>
          </mat-form-field>
          <mat-form-field>
            <input [formControl]="phone" maxlength="20" required matInput placeholder="Phone" name="phone">
            <mat-error *ngIf="phone.invalid">A valid phone number is required</mat-error>
          </mat-form-field>
          <mat-form-field>
            <input matInput required [formControl]="dob" placeholder="Date of birth" [matDatepicker]="picker"
                   name="dob">
            <mat-datepicker-toggle #toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error *ngIf="dob.invalid">A valid date of birth is required</mat-error>
          </mat-form-field>
          <mat-form-field>
            <textarea matInput required cols="2" placeholder="Address" name="address" [formControl]="address"></textarea>
            <mat-error *ngIf="address.invalid">Address is required</mat-error>
          </mat-form-field>
        </div>
        <button mat-flat-button type="button" routerLink="/login/student">I have already registered</button>
        <button mat-raised-button type="submit" color="primary" [disabled]="loading > 0 || form.invalid" class="float-right">SUBMIT
        </button>
      </div>
    </form>
  `,
  styles: [],
  providers: [DatePipe]
})
export class StudentRegComponent implements OnInit {
  form: FormGroup;

  loading = 0;

  departments: Department[] = [];
  semesters: Semester[] = [];
  religions = ['islam', 'hinduism', 'christianity', 'buddhism', 'other'];
  genders = ['male', 'female', 'other'];
  sessions = [];
  halls: Hall[] = [];

  get id() {
    return this.form.get('id');
  }

  get semester() {
    return this.form.get('semester');
  }

  get department() {
    return this.form.get('department');
  }

  get hall() {
    return this.form.get('hall');
  }

  get name() {
    return this.form.get('name');
  }


  get gender() {
    return this.form.get('gender');
  }


  get session() {
    return this.form.get('session');
  }


  get phone() {
    return this.form.get('phone');
  }


  get email() {
    return this.form.get('email');
  }


  get address() {
    return this.form.get('address');
  }


  get dob() {
    return this.form.get('dob');
  }

  get religion() {
    return this.form.get('religion');
  }


  constructor(private dp: DatePipe, private fb: FormBuilder, private ds: DepartmentService, private router: Router, private ss: StudentService) {
    this.form = fb.group({
      id: fb.control('', Validators.pattern(/^[1-9]\d{7}$/)),
      name: fb.control('', Validators.required),
      department: fb.control('', Validators.required),
      hall: fb.control('', Validators.required),
      semester: fb.control('', Validators.required),
      gender: fb.control('', Validators.required),
      session: fb.control('', Validators.required),
      dob: fb.control('', Validators.required),
      religion: fb.control('', Validators.required),
      phone: fb.control('', Validators.required),
      email: fb.control('', [Validators.required, Validators.email]),
      address: fb.control('', Validators.required),
    });
  }


  ngOnInit() {
    this.loading++;
    this.loadDepartments();
    this.generateSessions();
  }

  submit() {
    this.loading++;
    const student: Student = this.form.value;
    student.dob = this.dp.transform(this.form.value.dob, 'yyyy-MM-dd');
    console.log(student);
    this.ss.register(student).subscribe(
      res => {
        this.loading--;
        this.router.navigate(['/login/student/']);
      }, error1 => {
        console.log(error1);
        this.loading--;
      });
  }

  loadSemesters() {
    this.ds.getSemesters(this.department.value).subscribe(
      data => {
        this.semesters = data;
        this.loading--;
      }, error => {
        this.loading--;
      });
  }

  loadDepartments() {
    this.ds.getAllDepartments().subscribe(
      data => {
        this.departments = data;
        this.loading--;
      }, error => {
        this.loading--;
      });
  }

  loadHalls() {
    this.ds.getHalls(this.department.value).subscribe(
      data => {
        this.halls = data;
        this.loading--;
      }, error => {
        this.loading--;
      });
  }

  generateSessions() {
    for (let i = (new Date()).getFullYear(); i > 1966; i--) {
      this.sessions.push((i - 1) + ' - ' + i);
    }
  }

  onDeptChange() {
    this.loading += 2;
    this.loadSemesters();
    this.loadHalls();
  }
}
