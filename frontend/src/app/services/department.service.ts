import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {Observable, Subject} from 'rxjs';
import {Department, Exam, Hall, Semester, Student} from '../custom/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  studentAdded = new Subject();

  constructor(private auth: AuthService) {
  }

  getAllDepartments(): Observable<Department[]> {
    return this.auth.get<Department[]>('/api/departments/');
  }

  getAllStudents(deptId): Observable<Student[]> {
    return this.auth.get<Student[]>('/api/departments/' + deptId + '/students/');
  }

  getSemesters(departmentId): Observable<Semester[]> {
    return this.auth.get<Semester[]>('/api/departments/' + departmentId + '/semesters/');
  }

  getHalls(deptId) {
    return this.auth.get<Hall[]>('/api/departments/' + deptId + '/halls/');
  }

  getExams(deptId) {
    return this.auth.get<Exam[]>('/api/departments/' + deptId + '/exams/');
  }
}
