import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {StudentDashboardComponent} from './components/student-dashboard.component';
import {StudentLoginComponent} from './components/student-login.component';
import {StudentRegComponent} from './components/student-reg.component';
import {StudentGuard} from './guards/student.guard';
import {LoginComponent} from './components/login.component';

const routes: Routes = [
  {
    path: '', component: AppComponent, children: [
      {path: 'login/admin', component: LoginComponent},
      {path: 'login/student', component: StudentLoginComponent},
      {path: 'registration', component: StudentRegComponent},
      {
        path: 'student', component: StudentDashboardComponent, canActivate: [StudentGuard], children: [
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
