import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CustomModule} from './custom/custom.module';
import {LoginComponent} from './components/login.component';
import {StudentLoginComponent} from './components/student-login.component';
import {StudentRegComponent} from './components/student-reg.component';
import {StudentDashboardComponent} from './components/student-dashboard.component';
import {ExamFormComponent} from './components/exam-form.component';
import {AuthService} from './services/auth.service';
import {DepartmentService} from './services/department.service';
import {SemesterService} from './services/semester.service';
import {StudentService} from './services/student.service';
import {HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import {NotFoundComponent} from './components/not-found.component';
import {ChairmanDashboardComponent} from './components/chairman-dashboard.component';
import {ProvostComponent} from './components/provost.component';
import {BankComponent} from './components/bank.component';
import {OfficeComponent} from './components/office.component';
import {AccountsComponent} from './components/accounts.component';
import {ExamService} from './services/exam.service';
import {ExamFormService} from './services/exam-form.service';
import {AdminService} from './services/admin.service';
import {CreateExamComponent} from './components/create-exam.component';
import {ConfirmAttendanceComponent} from './components/confirm-attendance.component';
import {DatePipe} from '@angular/common';
import { InputAttendanceComponent } from './components/input-attendance.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StudentLoginComponent,
    StudentRegComponent,
    StudentDashboardComponent,
    ExamFormComponent,
    NotFoundComponent,
    ChairmanDashboardComponent,
    ProvostComponent,
    BankComponent,
    OfficeComponent,
    AccountsComponent,
    CreateExamComponent,
    ConfirmAttendanceComponent,
    InputAttendanceComponent
  ],
  imports: [
    CustomModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({cookieName: 'csrftoken', headerName: 'X-CSRFToken'}),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [DatePipe, AuthService, DepartmentService, SemesterService, AdminService, StudentService, ExamService, ExamFormService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
