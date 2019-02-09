import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-home-page',
  template: `
    <mat-toolbar color="primary">
      <img alt="CU Logo" height="90%" src="/static/frontend/assets/cu-logo.png">
      &nbsp;
      University of Chittagong<span class="spacer"></span>
      <button mat-button type="button" routerLink="/login/student">
        <mat-icon>school</mat-icon>
        Student Login
      </button>
      &nbsp;
      <button mat-button type="button" routerLink="/login/admin">
        <mat-icon>stars</mat-icon>
        Administrative Login
      </button>
    </mat-toolbar>
    <app-user-dash-board></app-user-dash-board>
  `,
  styles: []
})
export class HomePageComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
