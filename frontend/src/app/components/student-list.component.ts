import {Component, OnInit} from '@angular/core';
import {Student} from '../custom/interfaces';
import {DepartmentService} from '../services/department.service';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-student-list',
  template: `
    <table mat-table [dataSource]="students" class="panel-content">
      <ng-container matColumnDef="pic">
        <mat-header-cell *matHeaderCellDef>Avatar</mat-header-cell>
        <mat-cell *matCellDef="let s">
          <img alt="{{s.student}}" src="{{s.avatar}}" />
        </mat-cell>
      </ng-container>
      <ng-container matColumnDef="id">
        <mat-header-cell *matHeaderCellDef>ID</mat-header-cell>
        <mat-cell *matCellDef="let s">{{s.id}}</mat-cell>
      </ng-container>
      <ng-container matColumnDef="name">
        <mat-header-cell *matHeaderCellDef>Name</mat-header-cell>
        <mat-cell *matCellDef="let s">{{s.name}}</mat-cell>
      </ng-container>
      <ng-container matColumnDef="gender">
        <mat-header-cell *matHeaderCellDef>Gender</mat-header-cell>
        <mat-cell *matCellDef="let s">{{s.gender|titlecase}}</mat-cell>
      </ng-container>
      <ng-container matColumnDef="phone">
        <mat-header-cell *matHeaderCellDef>Phone</mat-header-cell>
        <mat-cell *matCellDef="let s">{{s.phone}}</mat-cell>
      </ng-container>
      <ng-container matColumnDef="email">
        <mat-header-cell *matHeaderCellDef>Email</mat-header-cell>
        <mat-cell *matCellDef="let s">{{s.email}}</mat-cell>
      </ng-container>
      <ng-container matColumnDef="address">
        <mat-header-cell *matHeaderCellDef>Address</mat-header-cell>
        <mat-cell *matCellDef="let s">{{s.address}}</mat-cell>
      </ng-container>

      <mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></mat-header-row>
      <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
    </table>
  `,
  styles: []
})
export class StudentListComponent implements OnInit {

  loading = 0;
  students: Student[] = [];

  displayedColumns = ['pic', 'id', 'name', 'gender', 'phone', 'email', 'address'];

  constructor(private sb: MatSnackBar, private ds: DepartmentService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(value => {
      this.loadStudents(value.deptId);
    });
    this.ds.studentAdded.subscribe(student => {
      this.students.push(student as Student);
    });
  }

  loadStudents(deptId) {
    this.loading++;
    this.ds.getAllStudents(deptId).subscribe(data => {
      this.students = data;
      this.loading--;
    }, error1 => {
      this.loading--;
      this.sb.open('Error loading students.', 'OK', { duration: 4000 });
    });
  }
}
