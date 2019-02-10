import {Component, OnInit} from '@angular/core';
import {Department, Exam} from '../custom/interfaces';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {AuthService} from '../services/auth.service';
import {DepartmentService} from '../services/department.service';
import {AdminService} from '../services/admin.service';

@Component({
  selector: 'app-office',
  template: `
    <mat-toolbar color="primary">
      <button (click)="drawer.toggle()" mat-icon-button type="button" title="Toggle Drawer">
        <mat-icon>menu</mat-icon>
      </button>
      {{auth.user.name}}<span class="spacer"></span>
      <button (click)="gotoAddStudent()" mat-icon-button type="button" title="Add new student.">
        <mat-icon>person_add</mat-icon>
      </button>
      <button (click)="gotoStudentList()" mat-icon-button type="button" title="View All Students">
        <mat-icon>people</mat-icon>
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
            <mat-list-item *ngIf="e.active && e.status == 1 && shouldInput(e)" routerLinkActive="active"
                           [routerLink]="'../dept-office/exams/'+e.id">
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
export class OfficeComponent implements OnInit {
  department: Department;
  exams: Exam[] = [];
  loading = 0;

  constructor(private router: Router, private sb: MatSnackBar, public auth: AuthService, private ds: DepartmentService, private admin: AdminService) {
  }

  ngOnInit() {
    this.loadDepartment();
    this.auth.examChanged.subscribe(val => {
      this.loadExams();
    });
  }

  loadExams() {
    this.loading++;
    this.ds.getExams(this.department.id).subscribe(data => {
      this.exams = data;
      this.loading--;
    }, error1 => {
      this.loading--;
      this.sb.open('Error loading exams.', 'OK', { duration: 4000 });
    });
  }

  loadDepartment() {
    this.loading++;
    this.admin.getDepartmentsOfChairman(this.auth.user.user).subscribe(data => {
      if (data.length > 0) {
        this.department = data[0];
        this.loadExams();
      } else {
        this.sb.open('Sorry, you are not associated with any department. You cannot add or view students.', 'OK', {duration: 5000});
      }
      this.loading--;
    }, error1 => {
      this.loading--;
      this.sb.open('Loading department failed. You cannot add or view students.', 'OK', { duration: 5000 });
    });
  }

  logout() {
    this.auth.logoutAdmin();
    this.router.navigate(['/login/admin']);
  }

  shouldInput(exam) {
    return (new Date(exam.ldo_form_fill_up)) < (new Date());
  }

  gotoAddStudent() {
    this.router.navigate(['../dept-office/register-student', {deptId: this.department.id}]);
  }

  gotoStudentList() {
    this.router.navigate(['../dept-office/all-students', {deptId: this.department.id}]);
  }
}
