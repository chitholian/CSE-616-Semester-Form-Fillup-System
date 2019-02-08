import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Semester} from '../custom/interfaces';
import {DepartmentService} from '../services/department.service';
import {ActivatedRoute} from '@angular/router';
import {ExamService} from '../services/exam.service';
import {AuthService} from '../services/auth.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-create-exam',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="panel mid-center">
      <div class="panel-content of-hidden">
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
          <input matInput required [formControl]="ldo_form_fill_up" placeholder="Last date of form-fillup"
                 [matDatepicker]="picker"
                 name="ldo_form_fill_up">
          <mat-datepicker-toggle #toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="ldo_form_fill_up.invalid">A valid date is required</mat-error>
        </mat-form-field>
        <button [disabled]="loading>0 || form.invalid" type="submit" mat-raised-button color="primary" class="float-right">SUBMIT</button>
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

  constructor(private dp: DatePipe, private auth: AuthService, private es: ExamService, private fb: FormBuilder, private ds: DepartmentService, private route: ActivatedRoute) {
    this.form = fb.group({
      title: fb.control('', Validators.required),
      semester: fb.control('', Validators.required),
      ldo_form_fill_up: fb.control('', Validators.required),
    });
  }

  ngOnInit() {
    this.loading++;
    this.loadSemesters();
  }

  submit() {
    this.loading++;
    const d = this.form.value;
    d.ldo_form_fill_up = this.dp.transform(d.ldo_form_fill_up, 'yyyy-MM-dd');
    this.es.createExam(d).subscribe(data => {
      this.loading--;
      this.auth.examChanged.next(true);
    }, error1 => {
      console.log(error1);
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
        console.log(error1);
        this.loading--;
      });
    });
  }
}
