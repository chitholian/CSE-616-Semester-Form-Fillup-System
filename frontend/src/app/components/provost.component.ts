import {Component, OnInit} from '@angular/core';
import {Exam, Hall} from '../custom/interfaces';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {AuthService} from '../services/auth.service';
import {AdminService} from '../services/admin.service';
import {ExamService} from '../services/exam.service';
import {HallService} from '../services/hall.service';

@Component({
  selector: 'app-provost',
  template: `
    <mat-toolbar color="primary">
      <button (click)="drawer.toggle()" mat-icon-button type="button" title="Toggle Drawer">
        <mat-icon>menu</mat-icon>
      </button>
      (Provost) {{hall.name}}<span class="spacer"></span>
      <button (click)="logout()" mat-icon-button type="button" title="Logout">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>
    <mat-drawer-container>

      <mat-drawer #drawer mode="side">
        <h3 class="mat-title">Active Exams</h3>
        <mat-nav-list>
          <ng-container *ngFor="let e of exams">
            <mat-list-item *ngIf="e.active && e.status == 4" routerLinkActive="active"
                           [routerLink]="'../hall-provost/exams/'+e.id">{{e.title}}
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
export class ProvostComponent implements OnInit {
  exams: Exam[] = [];
  // @ts-ignore
  hall: Hall = {name: ''};
  loading = 0;

  constructor(private as: AdminService, private router: Router, private sb: MatSnackBar, public auth: AuthService, private hs: HallService, private es: ExamService, private admin: AdminService) {
  }

  ngOnInit() {
    this.auth.examChanged.subscribe(val => {
      this.loadExams();
    });
    this.loadHall(this.auth.user.user);
  }

  loadExams() {
    this.loading++;
    this.hs.getAllExams(this.hall.id).subscribe(data => {
      this.exams = data.filter(value => {
        return value.status === 4;
      });
      this.loading--;
    }, error1 => {
      this.loading--;
      this.sb.open('Error loading exams', 'OK', {duration: 4000});
    });
  }

  logout() {
    this.auth.logoutAdmin();
    this.router.navigate(['/login/admin']);
  }

  loadHall(provostId) {
    this.loading++;
    this.as.getHallOfProvost(provostId).subscribe(data => {
      this.loading--;
      if (data.length > 0) {
        this.hall = data[0];
        this.auth.hall = this.hall;
        sessionStorage.setItem('hall', JSON.stringify(this.hall));
      } else {
        this.sb.open('You are not associated with any hall.', 'OK', {duration: 4000});
      }
      this.loadExams();
    }, error1 => {
      this.loading--;
      this.sb.open('Error loading hall info. You can do nothing but logout or reload.', 'OK', {duration: 4000});
    });
  }
}
