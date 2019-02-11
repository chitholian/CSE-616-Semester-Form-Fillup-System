import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Exam, Semester} from '../custom/interfaces';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SemesterService {

  constructor(private auth: AuthService) {
  }

  getExams(semId): Observable<Exam[]> {
    return this.auth.get<Exam[]>('/api/semesters/' + semId + '/exams/');
  }
  getInfo(semId): Observable<Semester> {
    return this.auth.get<Semester>('/api/semesters/' + semId + '/');
  }
}
