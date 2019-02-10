import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Exam, ExamForm} from '../custom/interfaces';
import {ExamService} from '../services/exam.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ExamFormService} from '../services/exam-form.service';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-exam-form-details',
  template: `
    <div class="panel" *ngIf="exam != null">
      <mat-toolbar>{{exam.title}}<span class="spacer"></span>
        Total Paid: {{totalPaidNumber}} {{(totalPaidNumber > 1 ? 'Students' : 'Student')}} <span
          *ngIf="exam.status < 6 && !expired(exam)">, Payable Until: <strong>{{exam.ldo_payment|date:'MMMM dd, yyy'}}</strong></span>
      </mat-toolbar>
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
          <mat-header-cell *matHeaderCellDef>Attendance</mat-header-cell>
          <mat-cell *matCellDef="let s">
            <span *ngIf="s.attendance >= 0">{{s.attendance}}%</span>
            <span *ngIf="s.attendance == -1">N/A</span>
          </mat-cell>
        </ng-container>
        <ng-container matColumnDef="status">
          <mat-header-cell *matHeaderCellDef>Paid</mat-header-cell>
          <mat-cell *matCellDef="let s">
            <mat-icon title="Unpaid" *ngIf="s.status == 5">clear</mat-icon>
            <mat-icon *ngIf="s.status == 6" title="Paid">check_circle</mat-icon>
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
      </table>
      <div class="panel-footer of-hidden">
        <button mat-raised-button (click)="finishExam()" class="float-right" color="accent" *ngIf="expired(exam)">FINISH THIS
          EXAM
        </button>
        <button mat-raised-button (click)="deleteExam()" class="float-right" color="warn" *ngIf="exam.status < 5">DELETE THIS EXAM</button>
        <span *ngIf="exam.status == 1">Applicable Until: <strong>{{exam.ldo_form_fill_up|date:'MMMM dd, yyy'}}</strong></span>
        <mat-error *ngIf="exam.status == 6 || expired(exam)">Payment Date Over.</mat-error>
      </div>
    </div>
  `,
  styles: []
})
export class ExamFormDetailsComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router, private sb: MatSnackBar, private efs: ExamFormService, private es: ExamService, private route: ActivatedRoute) {
  }

  loading = 0;
  exam: Exam;
  forms: ExamForm[];

  displayedColumns = ['id', 'name', 'session', 'attendance', 'status'];

  get totalPaidNumber(): any {
    if (this.forms === undefined) {
      return 'N/A';
    }
    let total = 0;
    for (const f of this.forms) {
      if (f.status === 6) {
        total++;
      }
    }
    return total;
  }

  expired(exam) {
    return exam != null && (new Date(exam.ldo_payment)) < (new Date());
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

  finishExam() {
    if (!confirm('Are you sure to finish this exam ?.')) {
      return;
    }
    this.loading++;
    this.es.finishExam(this.exam.id).subscribe(res => {
      this.loading--;
      this.auth.examChanged.next(true);
      this.router.navigate(['/dept-chairman']);
    }, error1 => {
      this.loading--;
      this.sb.open('Error finishing exam.', 'OK', {duration: 4000});
    });
  }

  deleteExam() {
    if (!confirm('Are you sure to delete this exam ? This is an unrecoverable operation.')) {
      return;
    }
    this.loading++;
    this.es.deleteExam(this.exam.id).subscribe(res => {
      this.loading--;
      this.auth.examChanged.next(true);
      this.router.navigate(['/dept-chairman']);
    }, error1 => {
      this.loading--;
      this.sb.open('Error deleting exam.', 'OK', {duration: 4000});
    });
  }
}
