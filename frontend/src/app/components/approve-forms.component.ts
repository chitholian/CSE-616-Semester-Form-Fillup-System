import {Component, OnInit} from '@angular/core';
import {MatSnackBar, MatTableDataSource} from '@angular/material';
import {Exam, ExamForm} from '../custom/interfaces';
import {ExamService} from '../services/exam.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ExamFormService} from '../services/exam-form.service';
import {AuthService} from '../services/auth.service';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-approve-forms',
  template: `
    <div class="panel of-hidden" *ngIf="exam != null">
      <mat-toolbar>{{exam.title}}</mat-toolbar>
      <table mat-table [dataSource]="forms" class="panel-content">
        <ng-container matColumnDef="check">
          <mat-header-cell *matHeaderCellDef>
            <mat-checkbox (change)="$event ? masterToggle() : null"
                          [checked]="selection.hasValue() && isAllSelected()"
                          [indeterminate]="selection.hasValue() && !isAllSelected()">
            </mat-checkbox>
          </mat-header-cell>
          <mat-cell *matCellDef="let s">
            <mat-checkbox (click)="$event.stopPropagation()"
                          (change)="$event ? selection.toggle(s) : null"
                          [checked]="selection.isSelected(s)">
            </mat-checkbox>
          </mat-cell>
        </ng-container>
        <ng-container matColumnDef="pic">
          <mat-header-cell *matHeaderCellDef>Avatar</mat-header-cell>
          <mat-cell *matCellDef="let s">
            <img alt="{{s.student}}" src="{{s.std_avatar}}"/>
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
        <ng-container matColumnDef="attendance">
          <mat-header-cell *matHeaderCellDef>Attendance</mat-header-cell>
          <mat-cell *matCellDef="let s">
            <span *ngIf="s.attendance >= 0">{{s.attendance}}%</span>
            <span *ngIf="s.attendance == -1">N/A</span>
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns;" (click)="selection.toggle(row)"></mat-row>
      </table>
      <div class="panel-footer of-hidden">
        <button (click)="submit()" mat-raised-button color="primary" class="float-right">APPROVE SELECTED</button>
      </div>
    </div>
  `,
  styles: [`
    mat-row {
      cursor: pointer;
    }`]
})
export class ApproveFormsComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router, private sb: MatSnackBar, private efs: ExamFormService, private es: ExamService, private route: ActivatedRoute) {
  }

  selection = new SelectionModel<ExamForm>(true, []);

  loading = 0;
  exam: Exam;
  forms: ExamForm[];
  dataSource = new MatTableDataSource<ExamForm>(this.forms);

  displayedColumns = ['check', 'pic', 'id', 'name', 'session', 'attendance'];

  expired(exam) {
    return exam != null && exam.ldo_payment != null && (new Date(exam.ldo_payment)) < (new Date());
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
        return value.std_gender === this.auth.hall.gender && value.attendance >= this.exam.fined_attendance;
      });
      this.loading--;
      this.dataSource = new MatTableDataSource<ExamForm>(this.forms);
    }, error1 => {
      this.loading--;
      this.sb.open('Error loading forms.', 'OK', {duration: 4000});
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  submit() {
    if (!confirm('Are you sure ? This reject the unselected forms. You cannot undo this.')) {
      return;
    }
    this.loading++;
    const selected = this.selection.selected;
    this.efs.approveForms(this.exam.id, selected).subscribe(res => {
      this.auth.examChanged.next(true);
      this.sb.open('Operation successful.', 'OK', {duration: 4000});
      this.loading--;
    }, err => {
      this.loading--;
      this.sb.open('Error processing request.', 'OK', {duration: 4000});
    });
  }
}
