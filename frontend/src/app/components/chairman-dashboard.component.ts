import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Department, Exam} from '../custom/interfaces';
import {DepartmentService} from '../services/department.service';
import {AdminService} from '../services/admin.service';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-chairman-dashboard',
  template: `
    <mat-toolbar color="primary">
      <button (click)="drawer.toggle()" mat-icon-button type="button" title="Toggle Drawer">
        <mat-icon>menu</mat-icon>
      </button>
      (Chairman) {{department.name}}<span class="spacer"></span>
      <button (click)="gotoCreateExam()" mat-icon-button type="button" title="Arrange an exam">
        <mat-icon>add</mat-icon>
      </button>
      <button (click)="gotoStudentList()" mat-icon-button type="button" title="View All Students">
        <mat-icon>group</mat-icon>
      </button>
      <button (click)="logout()" mat-icon-button type="button" title="Logout">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>
    <mat-drawer-container>

      <mat-drawer #drawer mode="side">
        <h3 class="mat-title">Active Exams</h3>
        <mat-nav-list>
          <ng-container *ngFor="let e of exams">
            <mat-list-item *ngIf="e.active" routerLinkActive="active"
                           [routerLink]="'../dept-chairman/exams/'+e.id">
              {{e.title}}
            </mat-list-item>
          </ng-container>
        </mat-nav-list>
      </mat-drawer>

      <mat-drawer-content>
        <router-outlet></router-outlet>
      </mat-drawer-content>

    </mat-drawer-container>
  `,
  styles: []
})
export class ChairmanDashboardComponent implements OnInit {
  // @ts-ignore
  department: Department = {name: ''};
  exams: Exam[] = [];
  loading = 0;

  constructor(private router: Router, private sb: MatSnackBar, public auth: AuthService, private ds: DepartmentService, private admin: AdminService) {
  }

  ngOnInit() {
    this.loading++;
    this.loadDepartment();
    this.auth.examChanged.subscribe(val => {
      this.loading++;
      this.loadExams();
    });
  }

  loadExams() {
    this.ds.getExams(this.department.id).subscribe(data => {
      this.exams = data;
      this.loading--;
    }, error1 => {
      this.loading--;
      this.sb.open('Error loading exams', 'OK', {duration: 4000});
    });
  }

  loadDepartment() {
    this.admin.getDepartmentsOfChairman(this.auth.user.user).subscribe(data => {
      if (data.length > 0) {
        this.department = data[0];
        this.loadExams();
      } else {
        this.sb.open('Sorry, you are not associated with any department. You cannot add or view students or arrange new exam.', 'OK', {duration: 5000});
      }
      this.loading--;
    }, error1 => {
      this.loading--;
      this.sb.open('Loading department failed. You cannot add or view students or arrange new exam.', 'OK', {duration: 5000});
    });
  }

  logout() {
    this.auth.logoutAdmin();
    this.router.navigate(['/login/admin']);
  }

  gotoCreateExam() {
    this.router.navigate(['../dept-chairman/create-exam', {deptId: this.department.id}]);
  }

  gotoStudentList() {
    this.router.navigate(['../dept-chairman/all-students', {deptId: this.department.id}]);
  }
}
