import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Exam} from '../custom/interfaces';
import {ExamService} from '../services/exam.service';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-impose-fees',
  template: `
    <form class="panel of-hidden" [formGroup]="form" (ngSubmit)="submit()">
      <mat-toolbar>{{exam.title}}</mat-toolbar>
      <div class="panel-content of-hidden">
        <mat-form-field>
          <input matInput type="number" min="0" name="fees_per_credit" required [formControl]="fees_per_credit"
                 placeholder="Fees Per Credit (BDT)">
          <mat-error *ngIf="fees_per_credit.invalid">Enter a valid amount.</mat-error>
        </mat-form-field>
        <mat-form-field>
          <input matInput type="number" min="0" name="mark_sheet_fees" required [formControl]="mark_sheet_fees"
                 placeholder="MarkSheet Fees (BDT)">
          <mat-error *ngIf="mark_sheet_fees.invalid">Enter a valid amount.</mat-error>
        </mat-form-field>
        <mat-form-field>
          <input matInput type="number" min="0" name="attendance_fine" required [formControl]="attendance_fine"
                 placeholder="Low Attendance Fees (BDT)">
          <mat-error *ngIf="attendance_fine.invalid">Enter a valid amount.</mat-error>
        </mat-form-field>
        <mat-form-field>
          <input matInput required [formControl]="ldo_payment" placeholder="Payable Until"
                 [matDatepicker]="picker"
                 name="ldo_payment">
          <mat-datepicker-toggle #toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="ldo_payment.invalid">A valid date is required</mat-error>
        </mat-form-field>
        <button [disabled]="loading > 0 || form.invalid" class="float-right" mat-raised-button color="primary" type="submit">SUBMIT</button>
      </div>
    </form>
  `,
  styles: []
})
export class ImposeFeesComponent implements OnInit {

  loading = 0;
  form: FormGroup;
  // @ts-ignore
  exam: Exam = {title: ''};

  get ldo_payment() {
    return this.form.get('ldo_payment');
  }

  get fees_per_credit() {
    return this.form.get('fees_per_credit');
  }

  get mark_sheet_fees() {
    return this.form.get('mark_sheet_fees');
  }

  get attendance_fine() {
    return this.form.get('attendance_fine');
  }

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private dp: DatePipe, private es: ExamService, private sb: MatSnackBar, private router: Router, private auth: AuthService) {
    this.form = fb.group({
      fees_per_credit: fb.control(50, [Validators.required, Validators.min(0)]),
      mark_sheet_fees: fb.control(180, [Validators.required, Validators.min(0)]),
      attendance_fine: fb.control(600, [Validators.required, Validators.min(0)]),
      ldo_payment: fb.control('', Validators.required),

    });
  }

  ngOnInit() {
    this.route.params.subscribe(value => {
      this.loadExam(value.id);
    });
  }

  submit() {
    this.loading++;
    const data = this.form.value;
    data.ldo_payment = this.dp.transform(data.ldo_payment, 'yyyy-MM-dd');
    data.status = 4;
    this.es.imposeFees(this.exam.id, data).subscribe(res => {
      this.sb.open('Fees imposure successful.', 'OK', {duration: 4000});
      this.auth.examChanged.next(true);
      this.loading--;
      this.router.navigate(['/accounts']);
    }, error1 => {
      this.loading--;
      this.sb.open('Error imposing fees.', 'OK');
    });
  }

  loadExam(examId) {
    this.loading++;
    this.es.getInfo(examId).subscribe(data => {
      this.exam = data;
      this.loading--;
    }, error1 => {
      this.loading--;
      this.sb.open('Error loading exam info.', 'OK', {duration: 4000});
    });
  }
}
