import {Component, OnInit} from '@angular/core';
import {Department, Exam} from '../custom/interfaces';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {AuthService} from '../services/auth.service';
import {DepartmentService} from '../services/department.service';
import {AdminService} from '../services/admin.service';
import {ExamService} from '../services/exam.service';

@Component({
  selector: 'app-bank',
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
            <mat-list-item *ngIf="e.active && e.status == 5 && !expired(e)" routerLinkActive="active"
                           [routerLink]="'../bank/exams/'+e.id">
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
export class BankComponent implements OnInit {
  exams: Exam[] = [];
  loading = 0;

  constructor(private router: Router, private sb: MatSnackBar, public auth: AuthService, private es: ExamService, private admin: AdminService) {
  }

  ngOnInit() {
    this.loading++;
    this.auth.examChanged.subscribe(val => {
      this.loading++;
      this.loadExams();
    });
    this.loadExams();
  }

  loadExams() {
    this.es.getAllExams().subscribe(data => {
      this.exams = data;
      this.loading--;
    }, error1 => {
      console.log(error1);
      this.loading--;
      this.sb.open('Error loading exams', 'OK');
    });
  }

  logout() {
    this.auth.logoutAdmin();
    this.router.navigate(['/login/admin']);
  }

  expired(exam) {
    return (new Date(exam.ldo_payment)) < (new Date());
  }
}
