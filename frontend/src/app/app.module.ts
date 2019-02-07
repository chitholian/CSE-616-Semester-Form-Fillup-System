import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CustomModule} from './custom/custom.module';
import { LoginComponent } from './components/login.component';
import { StudentLoginComponent } from './components/student-login.component';
import { StudentRegComponent } from './components/student-reg.component';
import { StudentDashboardComponent } from './components/student-dashboard.component';
import { ExamFormComponent } from './components/exam-form.component';
import {AuthService} from './services/auth.service';
import {DepartmentService} from './services/department.service';
import {SemesterService} from './services/semester.service';
import {StudentService} from './services/student.service';
import {HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StudentLoginComponent,
    StudentRegComponent,
    StudentDashboardComponent,
    ExamFormComponent
  ],
  imports: [
    CustomModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({cookieName: 'csrftoken', headerName: 'X-CSRFToken'}),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [AuthService, DepartmentService, SemesterService, StudentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
