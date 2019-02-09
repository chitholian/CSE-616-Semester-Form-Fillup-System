import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {Exam, ExamForm} from '../custom/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ExamService {


  constructor(private auth: AuthService) {
  }

  getAllExams(): Observable<Exam[]> {
    return this.auth.get<Exam[]>('/api/exams/');
  }

  createExam(data: {}) {
    return this.auth.post('/api/exams/', data);
  }

  apply(stdId, examId) {
    return this.auth.post('/api/exam-forms/', {exam: examId, student: stdId});
  }

  getInfo(examId): Observable<Exam> {
    return this.auth.get<Exam>('/api/exams/' + examId + '/');
  }

  getForms(examId): Observable<ExamForm[]> {
    return this.auth.get<ExamForm[]>('/api/exams/' + examId + '/forms/');
  }

  inputAttendances(forms) {
    return this.auth.patch('/api/input-attendances/', forms);
  }
}
