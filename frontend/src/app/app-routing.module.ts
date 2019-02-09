import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {StudentDashboardComponent} from './components/student-dashboard.component';
import {StudentLoginComponent} from './components/student-login.component';
import {StudentRegComponent} from './components/student-reg.component';
import {StudentGuard} from './guards/student.guard';
import {LoginComponent} from './components/login.component';
import {NotFoundComponent} from './components/not-found.component';
import {AdminUserGuard} from './guards/admin-user.guard';
import {ChairmanDashboardComponent} from './components/chairman-dashboard.component';
import {OfficeComponent} from './components/office.component';
import {BankComponent} from './components/bank.component';
import {AccountsComponent} from './components/accounts.component';
import {ProvostComponent} from './components/provost.component';
import {CreateExamComponent} from './components/create-exam.component';
import {InputAttendanceComponent} from './components/input-attendance.component';
import {ConfirmPaymentComponent} from './components/confirm-payment.component';
import {ExamFormDetailsComponent} from './components/exam-form-details.component';
import {StudentListComponent} from './components/student-list.component';
import {HomePageComponent} from './components/home-page.component';
import {UserDashBoardComponent} from './components/user-dash-board.component';

const routes: Routes = [
  {
    path: '', component: AppComponent, children: [
      {path: '', component: HomePageComponent},
      {path: 'login/admin', component: LoginComponent},
      {path: 'login/student', component: StudentLoginComponent},
      {path: 'student', component: StudentDashboardComponent, canActivate: [StudentGuard]}
    ]
  },
  {
    path: 'dept-chairman', component: ChairmanDashboardComponent, canActivate: [AdminUserGuard], children: [
      {path: '', component: UserDashBoardComponent},
      {path: 'create-exam', component: CreateExamComponent},
      {path: 'exams/:id', component: ExamFormDetailsComponent},
      {path: 'all-students', component: StudentListComponent},
    ]
  },
  {
    path: 'dept-office', component: OfficeComponent, canActivate: [AdminUserGuard], children: [
      {path: '', component: UserDashBoardComponent},
      {path: 'exams/:id', component: InputAttendanceComponent},
      {path: 'register-student', component: StudentRegComponent},
      {path: 'all-students', component: StudentListComponent},
    ]
  },
  {
    path: 'bank', component: BankComponent, canActivate: [AdminUserGuard], children: [
      {path: '', component: UserDashBoardComponent},
      {path: 'exams/:id', component: ConfirmPaymentComponent},
    ]
  },
  {path: 'accounts', component: AccountsComponent, canActivate: [AdminUserGuard]},
  {path: 'hall-provost', component: ProvostComponent, canActivate: [AdminUserGuard]},

  {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
