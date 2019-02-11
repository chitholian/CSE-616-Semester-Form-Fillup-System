import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Hall, Semester, Student} from '../custom/interfaces';
import {DepartmentService} from '../services/department.service';
import {StudentService} from '../services/student.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {AdminService} from '../services/admin.service';
import {MatSnackBar} from '@angular/material';
import {hasOwnProperty} from 'tslint/lib/utils';

@Component({
  selector: 'app-student-reg',
  template: `
    <mat-progress-bar mode="indeterminate" *ngIf="loading > 0"></mat-progress-bar>
    <form [formGroup]="form" (ngSubmit)="submit()" enctype="multipart/form-data">
      <div class="panel-content of-hidden">
        <div id="pic-zone">
          <input (change)="readURL($event)" accept=".jpeg, .jpg, .png, .gif"
                 #fileInput type="file" style="display: none;" required>
          <img (click)="fileInput.click()" #previewField alt="Photo" [src]="imageSrc || '/static/frontend/assets/no-image.gif'"
               id="preview"/>
        </div>
        <div>
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
              <mat-select [disabled]="loading > 0" [formControl]="semester" required placeholder="Semester">
                <mat-option *ngFor="let s of semesters" [value]="s.id">Semester {{s.number}}, Year {{s.year}}</mat-option>
              </mat-select>
              <mat-error *ngIf="semester.invalid">A semester is required</mat-error>
            </mat-form-field>
            <mat-form-field>
              <mat-select [disabled]="loading > 0 || gender.invalid" [formControl]="hall" required placeholder="Hall">
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
          </div>
          <mat-form-field>
            <textarea matInput required cols="2" placeholder="Address" name="address" [formControl]="address"></textarea>
            <mat-error *ngIf="address.invalid">Address is required</mat-error>
          </mat-form-field>
          <button mat-raised-button type="submit" color="primary" [disabled]="photo == null || loading > 0 || form.invalid"
                  class="float-right">SUBMIT
          </button>
        </div>
      </div>
    </form>
  `,
  styles: [`
    #preview {
      width: 180px;
      height: 200px;
      border: 1px solid black;
      border-radius: 3px;
      padding: 2px;
      cursor: pointer;
    }

    #pic-zone {
      text-align: center;
    }
  `]
})
export class StudentRegComponent implements OnInit {
  form: FormGroup;
  @ViewChild('fileInput') fileInput;
  @ViewChild('previewField') previewField;

  loading = 0;

  department: number;
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

  imageSrc: string;
  photo: File;


  constructor(private sb: MatSnackBar, private admin: AdminService, private dp: DatePipe, private fb: FormBuilder, private ds: DepartmentService, private router: Router, private ss: StudentService, private route: ActivatedRoute) {
    this.form = fb.group({
      id: fb.control('', Validators.pattern(/^[1-9]\d{7}$/)),
      name: fb.control('', Validators.required),
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
    this.route.params.subscribe(value => {
      this.department = value.deptId;
      this.loadSemesters();
      this.loadHalls();
    });
    this.generateSessions();
  }

  submit() {
    if (this.photo === null) {
      this.sb.open('Please select student\'s photo.', 'OK');
      return;
    }
    this.loading++;
    const student = this.form.value;
    student.dob = this.dp.transform(this.form.value.dob, 'yyyy-MM-dd');
    student.department = this.department;
    student.avatar = this.imageSrc;
    const formData = new FormData();
    formData.append('avatar', this.photo);
    for (const k in student) {
      if (student.hasOwnProperty(k)) {
        formData.append(k, student[k]);
      }
    }
    this.ss.register(formData).subscribe(
      res => {
        this.loading--;
        this.ds.studentAdded.next(student);
        this.sb.open('Registration successful.', 'OK', {duration: 4000});
      }, error1 => {
        this.sb.open('Failed to register student. May be ID already exists.', 'OK', {duration: 4000});
        this.loading--;
      });
  }

  loadSemesters() {
    this.loading++;
    this.ds.getSemesters(this.department).subscribe(
      data => {
        this.semesters = data;
        this.loading--;
      }, error => {
        this.loading--;
        this.sb.open('Error loading semesters.', 'OK', {duration: 4000});
      });
  }

  loadHalls() {
    this.loading++;
    this.ds.getHalls(this.department).subscribe(
      data => {
        this.halls = data;
        this.loading--;
      }, error => {
        this.loading--;
        this.sb.open('Error loading halls.', 'OK', {duration: 4000});
      });
  }

  generateSessions() {
    for (let i = (new Date()).getFullYear(); i > 1966; i--) {
      this.sessions.push((i - 1) + ' - ' + i);
    }
  }

  readURL(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.photo = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev: any) => {
        this.imageSrc = ev.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
}
