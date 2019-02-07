import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {Student} from '../custom/interfaces';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private auth: AuthService) {
  }

  register(data: Student) {
    return this.auth.post<any>('/api/students/', data);
  }
}
