import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Student} from '../custom/interfaces';
import {Router} from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  template: `
    <!--    <ng-container *ngIf="loggedIn">
          <router-outlet></router-outlet>
        </ng-container>
        <app-student-login *ngIf="!loggedIn"></app-student-login>-->
    <mat-toolbar color="primary">{{student.name}}</mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class StudentDashboardComponent implements OnInit {

  student: Student;

  get loggedIn() {
    return this.student != null;
  }

  constructor(private auth: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.student = this.auth.student;
    if (this.student == null) {
      // this.router.navigate(['login/student']);
      // window.location.href = './student/login';
    }
  }

}
