import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {ExamForm, Student} from '../custom/interfaces';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private auth: AuthService) {
  }

  register(data: Student) {
    return this.auth.post<any>('/api/students/', data);
  }

  getForms(studentId, examId): Observable<ExamForm[]> {
    return this.auth.get<ExamForm[]>('/api/students/' + studentId + '/forms/?exam-id=' + examId);
  }
}
