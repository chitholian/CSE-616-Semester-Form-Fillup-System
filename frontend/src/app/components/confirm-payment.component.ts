import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Course, Exam, ExamForm} from '../custom/interfaces';
import {ExamService} from '../services/exam.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ExamFormService} from '../services/exam-form.service';
import {AuthService} from '../services/auth.service';
import {SemesterService} from '../services/semester.service';

@Component({
  selector: 'app-confirm-payment',
  template: `
    <div class="panel" *ngIf="exam != null">
      <mat-toolbar>{{exam.title}}<span class="spacer"></span>Payable until: {{exam.ldo_payment | date :'MMMM dd, yyyy'}} </mat-toolbar>
      <mat-progress-bar mode="indeterminate" *ngIf="loading>0"></mat-progress-bar>
      <table mat-table [dataSource]="forms" class="panel-content">
        <ng-container matColumnDef="pic">
          <mat-header-cell *matHeaderCellDef>Avatar</mat-header-cell>
          <mat-cell *matCellDef="let s">
            <img alt="{{s.student}}" src="{{s.std_avatar}}" />
          </mat-cell>
        </ng-container>
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
        <ng-container matColumnDef="fees">
          <mat-header-cell *matHeaderCellDef>Total Fees (BDT)</mat-header-cell>
          <mat-cell *matCellDef="let s">{{calculateFees(s)}}.00 TK</mat-cell>
        </ng-container>
        <ng-container matColumnDef="status">
          <mat-header-cell *matHeaderCellDef>Paid</mat-header-cell>
          <mat-cell *matCellDef="let s">
            <button title="Unpaid" mat-icon-button [disabled]="loading>0" (click)="toggleFormStatus(s)" *ngIf="s.status == 5">
              <mat-icon>clear</mat-icon>
            </button>
            <button title="Paid" mat-icon-button [disabled]="loading>0" (click)="toggleFormStatus(s)" *ngIf="s.status == 6">
              <mat-icon>check_circle</mat-icon>
            </button>
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
      </table>
    </div>
  `,
  styles: [`mat-progress-bar {
    width: 100%;
    position: fixed;
    top: 64px;
  }`]
})
export class ConfirmPaymentComponent implements OnInit {

  constructor(private ss: SemesterService, private auth: AuthService, private router: Router, private sb: MatSnackBar, private efs: ExamFormService, private es: ExamService, private route: ActivatedRoute) {
  }

  courses: Course[] = [];
  loading = 0;
  exam: Exam;
  forms: ExamForm[];

  displayedColumns = ['pic', 'id', 'name', 'session', 'fees', 'status'];

  expired(exam) {
    return exam.ldo_payment != null && (new Date(exam.ldo_payment)) < (new Date());
  }

  ngOnInit() {
    this.route.params.subscribe(value => {
      this.loadExam(value.id);
      this.loadForms(value.id);
    });
  }

  loadExam(examId) {
    this.loading++;
    this.es.getInfo(examId).subscribe(res => {
      this.exam = res;
      this.loadCourses();
      if (res.status !== 5 || this.expired(res)) {
        this.loading--;
        this.router.navigate(['/bank']);
      }
      this.loading--;
    }, err => {
      this.sb.open('Error loading exam info or not found.', 'OK', {duration: 4000});
      this.loading--;
    });
  }

  loadForms(examId) {
    this.loading++;
    this.es.getForms(examId).subscribe(res => {
      this.forms = res.filter(value => {
        return value.attendance >= 60;
      });
      this.loading--;
    }, error1 => {
      this.loading--;
      this.sb.open('Error loading forms.', 'OK', {duration: 4000});
    });
  }

  toggleFormStatus(form) {
    const target = form.status === 5 ? 6 : 5;
    if (target === 5 && !confirm('Are you sure to undo the payment ?')) {
      return;
    }
    this.loading++;
    this.efs.patch({id: form.id, status: target}).subscribe(re => {
      form.status = target;
      this.loading--;
    }, error1 => {
      this.sb.open('Error processing request.', 'OK', {duration: 4000});
      this.loading--;
    });
  }

  calculateFees(form) {
    let fees = this.exam.mark_sheet_fees;
    for (const c of this.courses) {
      fees += c.credits * this.exam.fees_per_credit;
    }

    if (form.attendance < this.exam.allowed_attendance && form.attendance >= this.exam.fined_attendance) {
      fees += this.exam.attendance_fine;
    }
    return fees;
  }

  loadCourses() {
    this.loading++;
    this.ss.getInfo(this.exam.id).subscribe(data => {
      this.loading--;
      this.courses = data.courses;
    }, error1 => {
      this.loading--;
      this.sb.open('Error loading course list, cannot calculate fees.', 'OK', {duration: 4000});
    });
  }
}
