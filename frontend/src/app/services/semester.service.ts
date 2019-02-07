import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Department, Semester} from '../custom/interfaces';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SemesterService {

  constructor(private auth: AuthService) {
  }
}
