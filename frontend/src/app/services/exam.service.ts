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

  inputAttendances(examId, formList) {
    return this.auth.patch('/api/input-attendances/', {exam_id: examId, forms: formList});
  }

  deleteExam(examId) {
    return this.auth.delete('/api/exams/' + examId + '/');
  }

  finishExam(examId) {
    return this.auth.patch('/api/exams/' + examId + '/', {id: examId, active: false});
  }

  imposeFees(examId, fees) {
    return this.auth.patch('/api/exams/' + examId + '/', fees);
  }
}
