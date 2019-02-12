import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {Exam} from '../custom/interfaces';

@Injectable({
  providedIn: 'root'
})
export class HallService {

  constructor(private auth: AuthService) {
  }

  getAllExams(hallID): Observable<Exam[]> {
    return this.auth.get<Exam[]>('/api/halls/' + hallID + '/exams/');
  }
}
