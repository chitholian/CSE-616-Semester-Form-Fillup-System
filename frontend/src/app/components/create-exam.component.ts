import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Semester} from '../custom/interfaces';
import {DepartmentService} from '../services/department.service';
import {ActivatedRoute} from '@angular/router';
import {ExamService} from '../services/exam.service';
import {AuthService} from '../services/auth.service';
import {DatePipe} from '@angular/common';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-create-exam',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="panel">
      <mat-toolbar>Arrange an Examination</mat-toolbar>
      <mat-progress-bar mode="indeterminate" *ngIf="loading>0"></mat-progress-bar>
      <div class="panel-content of-hidden">
        <div class="col-1-2">

          <mat-form-field>
            <input matInput placeholder="Exam Title" required [formControl]="title" name="title">
            <mat-error *ngIf="title.invalid">Exam title is required</mat-error>
          </mat-form-field>
          <mat-form-field>
            <mat-select placeholder="Semester" required [formControl]="semester">
              <mat-option *ngFor="let s of semesters" [value]="s.id">Semester {{s.number}}, Year {{s.year}}</mat-option>
            </mat-select>
            <mat-error *ngIf="semester.invalid">Semester is required</mat-error>
          </mat-form-field>
          <mat-form-field>
            <input matInput type="number" min="0" max="100" step="1" placeholder="Allowed Attendance (%)" required [formControl]="allowed"
                   name="allowed_attendance">
            <mat-error *ngIf="allowed.invalid">Value must be 0-100</mat-error>
          </mat-form-field>
          <mat-form-field>
            <input matInput type="number" min="0" max="100" step="1" placeholder="Fined Attendance (%)" required [formControl]="fined"
                   name="fined_attendance">
            <mat-error *ngIf="fined.invalid">This value must be less than allowed attendance</mat-error>
          </mat-form-field>
        </div>
        <div class="col-1-2">
          <mat-form-field>
            <input matInput type="number" placeholder="Fees Per Credit (BDT)" min="0" required [formControl]="fees" name="fees_per_credit">
            <mat-error *ngIf="fees.invalid">A valid amount is required</mat-error>
          </mat-form-field>
          <mat-form-field>
            <input matInput type="number" placeholder="Low Attendance Fine (BDT)" min="0" required [formControl]="fine"
                   name="attendance_fine">
            <mat-error *ngIf="fine.invalid">A valid amount is required</mat-error>
          </mat-form-field>
          <mat-form-field>
            <input matInput required [formControl]="ldo_form_fill_up" placeholder="Applicable Until"
                   [matDatepicker]="picker"
                   name="ldo_form_fill_up">
            <mat-datepicker-toggle #toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error *ngIf="ldo_form_fill_up.invalid">A valid date is required</mat-error>
          </mat-form-field>
          <mat-form-field *ngIf="ldo_form_fill_up.valid">
            <input matInput required [formControl]="ldo_payment" placeholder="Payable Until"
                   [matDatepicker]="picker2"
                   name="ldo_payment">
            <mat-datepicker-toggle #toggle2 matSuffix [for]="picker2"></mat-datepicker-toggle>
            <mat-datepicker #picker2></mat-datepicker>
            <mat-error *ngIf="ldo_payment.invalid">This date must be greater than the above</mat-error>
          </mat-form-field>
          <button [disabled]="loading>0 || form.invalid" type="submit" mat-raised-button color="primary" class="float-right">SUBMIT</button>
        </div>
      </div>
    </form>
  `,
  styles: []
})
export class CreateExamComponent implements OnInit {

  form: FormGroup;

  loading = 0;

  semesters: Semester[] = [];

  get semester() {
    return this.form.get('semester');
  }

  get title() {
    return this.form.get('title');
  }

  get ldo_form_fill_up() {
    return this.form.get('ldo_form_fill_up');
  }

  get ldo_payment() {
    return this.form.get('ldo_payment');
  }

  get fees() {
    return this.form.get('fees_per_credit');
  }

  get fine() {
    return this.form.get('attendance_fine');
  }

  get allowed() {
    return this.form.get('allowed_attendance');
  }

  get fined() {
    return this.form.get('fined_attendance');
  }

  constructor(private sb: MatSnackBar, private dp: DatePipe, private auth: AuthService, private es: ExamService, private fb: FormBuilder, private ds: DepartmentService, private route: ActivatedRoute) {
    this.form = fb.group({
      title: fb.control('', Validators.required),
      semester: fb.control('', Validators.required),
      fees_per_credit: fb.control(50, [Validators.required, Validators.min(0)]),
      allowed_attendance: fb.control(70, [Validators.required, Validators.min(0), Validators.max(100)]),
      fined_attendance: fb.control(60, [Validators.required, Validators.min(0), Validators.max(100)]),
      attendance_fine: fb.control(600, [Validators.required, Validators.min(0)]),
      ldo_form_fill_up: fb.control('', Validators.required),
      ldo_payment: fb.control('', Validators.required),
    }, {validators: customRangeValidator});
  }

  ngOnInit() {
    this.loading++;
    this.loadSemesters();
  }

  submit() {
    this.loading++;
    const d = this.form.value;
    d.ldo_form_fill_up = this.dp.transform(d.ldo_form_fill_up, 'yyyy-MM-dd');
    d.ldo_payment = this.dp.transform(d.ldo_payment, 'yyyy-MM-dd');
    this.es.createExam(d).subscribe(data => {
      this.loading--;
      this.sb.open('Exam Created Successfully.', 'OK', { duration: 4000 });
      this.auth.examChanged.next(true);
    }, error1 => {
      this.sb.open('Error creating exam.', 'OK', { duration: 4000 });
      this.loading--;
    });
  }

  loadSemesters() {
    console.log(this.route);
    this.route.params.subscribe(value => {
      this.ds.getSemesters(value.deptId).subscribe(data => {
        this.semesters = data;
        this.loading--;
      }, error1 => {
        this.loading--;
        this.sb.open('Error loading semesters.', 'OK', { duration: 4000 });
      });
    });
  }
}

export function customRangeValidator(group: FormGroup) {
  const date1 = group.controls.ldo_form_fill_up;
  const date2 = group.controls.ldo_payment;
  const attd1 = group.controls.allowed_attendance;
  const attd2 = group.controls.fined_attendance;
  if (date1.value >= date2.value) {
    date2.setErrors({customRangeValidator: true});
  } else {
    date2.setErrors(null);
  }
  if (attd2.value >= attd1.value) {
    attd2.setErrors({customRangeValidator: true});
  } else {
    attd2.setErrors(null);
  }
  return null;
}
