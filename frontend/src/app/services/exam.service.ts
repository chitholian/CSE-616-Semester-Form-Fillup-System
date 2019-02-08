import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExamService {


  constructor(private auth: AuthService) {
  }

  createExam(data: {}) {
    return this.auth.post('/api/exams/', data);
  }

  apply(stdId, examId) {
    return this.auth.post('/api/exam-forms/', {exam: examId, student: stdId});
  }
}
