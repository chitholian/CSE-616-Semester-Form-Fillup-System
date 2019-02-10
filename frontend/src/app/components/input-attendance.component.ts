import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Exam, ExamForm} from '../custom/interfaces';
import {DepartmentService} from '../services/department.service';
import {ExamService} from '../services/exam.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-input-attendance',
  template: `
    <div class="panel" *ngIf="exam != null">
      <mat-toolbar>{{exam.title}}</mat-toolbar>
      <mat-progress-bar mode="indeterminate" *ngIf="loading>0"></mat-progress-bar>
      <table mat-table [dataSource]="forms" class="panel-content">
        <ng-container matColumnDef="id">
          <mat-header-cell *matHeaderCellDef>ID</mat-header-cell>
          <mat-cell *matCellDef="let s">{{s.student}}</mat-cell>
        </ng-container>
        <ng-container matColumnDef="name">
          <mat-header-cell *matHeaderCellDef>Name</mat-header-cell>
          <mat-cell *matCellDef="let s">{{s.std_name}}</mat-cell>
        </ng-container>
        <ng-container matColumnDef="session">
          <mat-header-cell *matHeaderCellDef>Session</mat-header-cell>
          <mat-cell *matCellDef="let s">{{s.std_session}}</mat-cell>
        </ng-container>
        <ng-container matColumnDef="attendance">
          <mat-header-cell *matHeaderCellDef>Attendance (%)</mat-header-cell>
          <mat-cell *matCellDef="let s">
            <mat-form-field floatLabel="never">
              <input [disabled]="loading > 0" matInput pattern="^[1-9]?[0-9]$" autocomplete="off" [(ngModel)]="s.attendance"
                     maxlength="2" (focus)="$event.target.select()" (keypress)="filterValue($event)"
                     (ngModelChange)="s.attendance = asNumber($event)">
            </mat-form-field>
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
      </table>
      <div class="panel-footer of-hidden">
        <button class="float-right" mat-raised-button color="warn" (click)="apply()" [disabled]="loading > 0">CHECK AND SUBMIT</button>
      </div>
    </div>
  `,
  styles: [`mat-progress-bar{width: 100%;position: fixed;top: 64px;}`]
})
export class InputAttendanceComponent implements OnInit {

  loading = 0;
  exam: Exam;
  forms: ExamForm[];

  displayedColumns = ['id', 'name', 'session', 'attendance'];

  constructor(private router: Router, private as: AuthService, private sb: MatSnackBar, private ds: DepartmentService, private es: ExamService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(value => {
      this.loadExam(value.id);
      this.loadForms(value.id);
    });
  }

  apply() {
    this.loading++;
    for (const f of this.forms) {
      console.log(f.attendance);
      if (f.attendance === -1) {
        this.sb.open('There are unchecked fields (i.e. negative values). Please make them zero at least.', 'OK', { duration: 4000 });
        this.loading--;
        return;
      }
    }
    if (confirm('Are you sure to submit all the entries ? You cannot undo this.')) {
      // Send the entire array of forms to the server.
      this.es.inputAttendances(this.forms).subscribe(res => {
        this.as.examChanged.next(true);
        this.loading--;
        this.router.navigate(['/dept-office']);
      }, error1 => {
        this.loading--;
        this.sb.open('Error processing request.', 'OK', { duration: 4000 });
      });
    } else {
      this.loading--;
    }
  }

  filterValue(event) {
    return new RegExp('[0-9]').test(event.key);
  }

  asNumber(val) {
    return Number(val);
  }

  loadExam(examId) {
    this.loading++;
    this.es.getInfo(examId).subscribe(res => {
      this.exam = res;
      if (res.status !== 1 || this.shouldNotInput(res)) {
        this.loading--;
        this.router.navigate(['/dept-office']);
      }
      this.loading--;
    }, err => {
      this.sb.open('Error loading exam info or not found.', 'OK', { duration: 4000 });
      this.loading--;
    });
  }

  loadForms(examId) {
    this.es.getForms(examId).subscribe(res => {
      this.forms = res;
      this.loading--;
    }, error1 => {
      this.sb.open('Error loading forms.', 'OK', { duration: 4000 });
      this.loading--;
    });
  }

  shouldNotInput(exam) {
    return (new Date(exam.ldo_form_fill_up)) >= (new Date());
  }
}
