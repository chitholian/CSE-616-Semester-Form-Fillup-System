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
import {ConfirmAttendanceComponent} from './components/confirm-attendance.component';
import {InputAttendanceComponent} from './components/input-attendance.component';
import {ConfirmPaymentComponent} from './components/confirm-payment.component';

const routes: Routes = [
  {
    path: '', component: AppComponent, children: [
      {path: 'login/admin', component: LoginComponent},
      {path: 'login/student', component: StudentLoginComponent},
      {path: 'registration', component: StudentRegComponent},
      {
        path: 'student', component: StudentDashboardComponent, canActivate: [StudentGuard], children: []
      }
    ]
  },
  {
    path: 'dept-chairman', component: ChairmanDashboardComponent, canActivate: [AdminUserGuard], children: [
      {path: 'create-exam', component: CreateExamComponent},
      {path: 'exams/:id', component: ConfirmAttendanceComponent},
    ]
  },
  {
    path: 'dept-office', component: OfficeComponent, canActivate: [AdminUserGuard], children: [
      {path: 'exams/:id', component: InputAttendanceComponent},
    ]
  },
  {
    path: 'bank', component: BankComponent, canActivate: [AdminUserGuard], children: [
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
