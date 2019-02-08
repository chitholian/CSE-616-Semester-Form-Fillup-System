import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {Department, Exam, Hall, Semester} from '../custom/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private auth: AuthService) {
  }

  getAllDepartments(): Observable<Department[]> {
    return this.auth.get<Department[]>('http://127.0.0.1:8000/api/departments/');
  }

  getSemesters(departmentId): Observable<Semester[]> {
    return this.auth.get<Semester[]>('http://127.0.0.1:8000/api/departments/' + departmentId + '/semesters/');
  }

  getHalls(deptId) {
    return this.auth.get<Hall[]>('http://127.0.0.1:8000/api/departments/' + deptId + '/halls/');
  }

  getExams(deptId) {
    return this.auth.get<Exam[]>('http://127.0.0.1:8000/api/departments/' + deptId + '/exams/');
  }
}
