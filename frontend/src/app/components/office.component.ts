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
      <button (click)="logout()" mat-icon-button type="button" title="Logout">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>
    <mat-drawer-container>

      <mat-drawer #drawer mode="side">
        <h3 class="mat-title">Active Exams</h3>
        <mat-nav-list>
          <ng-container *ngFor="let e of exams">
            <mat-list-item *ngIf="e.active && e.status == 1" routerLinkActive="active"
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
      console.log(error1);
      this.loading--;
      this.sb.open('Error loading semesters', 'OK');
    });
  }

  loadDepartment() {
    this.admin.getDepartmentsOfChairman(this.auth.user.user).subscribe(data => {
      if (data.length > 0) {
        this.department = data[0];
        this.loadExams();
      } else {
        this.sb.open('Loading department failed', 'OK');
      }
      this.loading--;
    }, error1 => {
      console.log(error1);
      this.loading--;
      this.sb.open('Loading department failed', 'OK');
    });
  }

  logout() {
    this.auth.logoutAdmin();
    this.router.navigate(['/login/admin']);
  }
}
