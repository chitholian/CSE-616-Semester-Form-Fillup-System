import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Course, Exam, ExamForm, Student} from '../custom/interfaces';
import {Router} from '@angular/router';
import {SemesterService} from '../services/semester.service';
import {StudentService} from '../services/student.service';
import {ExamService} from '../services/exam.service';

@Component({
  selector: 'app-student-dashboard',
  template: `
    <mat-toolbar color="primary">{{student.name}}<span class="spacer"></span>
      <button (click)="logout()" mat-icon-button type="button" title="Logout">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>
    <div class="panel" *ngFor="let e of exams">
      <mat-toolbar>{{e.title}}<span class="spacer"></span>
        <button mat-button *ngIf="examForm.status == 0 && !expired(e.ldo_form_fill_up)" (click)="applyNow(e)" [disabled]="loading > 0">APPLY
          NOW
        </button>
        <mat-error *ngIf="examForm.status == 0 && expired(e.ldo_form_fill_up)">Application Deadline Expired</mat-error>
        <mat-error *ngIf="examForm.status == 5 && expired(e.ldo_payment)">Payment Deadline Expired</mat-error>
      </mat-toolbar>
      <table mat-table [dataSource]="courses" class="panel-content">
        <ng-container matColumnDef="code">
          <th mat-header-cell *matHeaderCellDef>Course Code</th>
          <td mat-cell *matCellDef="let c">{{c.code}}</td>
        </ng-container>

        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>Course Title</th>
          <td mat-cell *matCellDef="let c">{{c.title}}</td>
        </ng-container>

        <ng-container matColumnDef="credits">
          <th mat-header-cell *matHeaderCellDef>Credits</th>
          <td mat-cell *matCellDef="let c">{{c.credits | number:'1.2-2'}}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayColumns"></tr>
        <tr mat-row *matRowDef="let row;columns: displayColumns;"></tr>
      </table>
      <div class="panel-footer of-hidden">
        <span class="float-right" *ngIf="examForm.status > 1">Attendance: {{examForm.attendance}}%</span>
        <strong>Status: </strong>
        <mat-error *ngIf="examForm.status > 1 && examForm.attendance < 60">Form rejected due to low attendance
        </mat-error>
        <mat-error *ngIf="examForm.status == 5 && expired(e.ldo_payment)">Form rejected due to no payment
        </mat-error>
        <span *ngIf="!(e.status > 1 && examForm.attendance < 60) && !(expired(e.ldo_payment) && examForm.status < 6)">
          {{statusMessages[examForm.status]}}</span>
        <p *ngIf="examForm.status == 0 && !expired(e.ldo_form_fill_up)">Last Date of Application:
          <strong>{{e.ldo_form_fill_up|date:'MMMM dd, yyyy'}}</strong></p>
        <p *ngIf="examForm.status == 5 && !expired(e.ldo_payment)">Total Fees: <strong>{{calculateFees(e) | number :'1.2-2'}} BDT</strong>,
          Last Date of Payment: <strong>{{e.ldo_payment|date:'MMMM dd, yyyy'}}</strong></p>
      </div>
    </div>
  `,
  styles: []
})
export class StudentDashboardComponent implements OnInit {

  // @ts-ignore
  examForm: ExamForm = {status: 0};
  loading = 0;
  statusMessages = [
    'Not applied yet.',
    'Pending for attendance entry.',
    'Pending for chairman approval.',
    'Pending for provost approval.',
    'Pending at accounts office.',
    'Pending for payment.',
    'Payment confirmed.',
    'Application rejected.'
  ];
  student: Student;
  displayColumns = ['code', 'title', 'credits'];

  exams: Exam[] = [];
  courses: Course[] = [];

  get loggedIn() {
    return this.student != null;
  }

  constructor(private auth: AuthService, private router: Router, private ss: SemesterService, private std: StudentService, private es: ExamService) {
  }

  ngOnInit() {
    this.student = this.auth.student;
    if (this.student == null) {
      this.router.navigate(['login/student']);
    }
    this.loadExams();
  }

  logout() {
    this.auth.logoutStudent();
    this.router.navigate(['/login/student/']);
  }

  applyNow(exam) {
    this.loading++;
    this.es.apply(this.student.id, exam.id).subscribe(d => {
      this.loading--;
      this.checkIfApplied(exam.id);
    }, error1 => {
      console.log(error1);
      this.loading--;
    });
  }

  calculateFees(exam) {
    let fees = 0.0;
    for (const c of this.courses) {
      fees += c.credits * exam.fees_per_credit;
    }

    if (this.examForm.attendance < 70 && this.examForm.attendance >= 60) {
      fees += exam.attendance_fine;
    }
    return fees;
  }

  loadExams() {
    this.loading += 2;
    this.ss.getExams(this.student.semester).subscribe(data => {
      this.loading--;
      this.exams = data;
      if (data.length > 0) {
        this.checkIfApplied(data[0].id);
      }
      this.ss.getInfo(this.student.semester).subscribe(d => {
        this.loading--;
        this.courses = d.courses;
        this.ss.getInfo(this.student.semester);
      }, error => {
        console.log(error);
        this.loading--;
      });
    }, error1 => {
      console.log(error1);
      this.loading--;
    });
  }

  checkIfApplied(examId) {
    this.loading++;
    this.std.getForms(this.student.id, this.exams[0].id).subscribe(data => {
      if (data.length > 0) {
        this.examForm = data[0];
      }
      this.loading--;
    }, error1 => {
      this.loading--;
      console.log(error1);
    });
  }

  expired(date) {
    return (new Date(date)) < (new Date());
  }
}
