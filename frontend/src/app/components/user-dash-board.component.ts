import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-user-dash-board',
  template: `
    <div class="">
      <h3>!! WELCOME !!</h3>
      <h2>Semester Form Fill Up System</h2>
      <p>Here you can do your staff.</p>
      <hr>
      <h3>Team Members</h3>
      <hr>
      <div class="of-hidden">
        <div class="col-1-5">
          <h4><a href="https://github.com/chitholian/" target="_blank">ATIKUR RAHMAN</a></h4>
          ID: <strong>16701016</strong><br>
          Session: <strong>2015 - 2016</strong><br>
          Department of <br><strong>Computer Science and Engineering</strong><br>
          <strong>University of Chittagong</strong>
        </div>
        <div class="col-1-5">
          <h4>Md. Foysal Hossain</h4>
          ID: <strong>16701007</strong><br>
          Session: <strong>2015 - 2016</strong><br>
          Department of <br><strong>Computer Science and Engineering</strong><br>
          <strong>University of Chittagong</strong>
        </div>
      </div>
      <hr>
      <div class="of-hidden">
        <div class="col-1-5">
          <h4>Ahsan Ullah</h4>
          ID: <strong>16701019</strong><br>
          Session: <strong>2015 - 2016</strong><br>
          Department of <br><strong>Computer Science and Engineering</strong><br>
          <strong>University of Chittagong</strong>
        </div>
        <div class="col-1-5">
          <h4>Jawwad Bin Zahir</h4>
          ID: <strong>16701051</strong><br>
          Session: <strong>2015 - 2016</strong><br>
          Department of <br><strong>Computer Science and Engineering</strong><br>
          <strong>University of Chittagong</strong>
        </div>
        <div class="col-1-5">
          <h4>Tamanna Akhter Mukta</h4>
          ID: <strong>167010..</strong><br>
          Session: <strong>2015 - 2016</strong><br>
          Department of <br><strong>Computer Science and Engineering</strong><br>
          <strong>University of Chittagong</strong>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * {
      text-align: center;
    }

    .col-1-5 {
      line-height: 1.3em;
      display: inline-block;
      margin: auto;
      padding: 10px;
    }
  `]
})
export class UserDashBoardComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
