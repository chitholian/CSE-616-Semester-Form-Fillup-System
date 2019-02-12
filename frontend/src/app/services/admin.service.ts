import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {Department, Hall} from '../custom/interfaces';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private auth: AuthService) {
  }

  getDepartmentsOfChairman(chairmanId) {
    return this.auth.get<Department[]>('/api/admins/' + chairmanId + '/departments/');
  }

  getHallOfProvost(provostID): Observable<Hall[]> {
    return this.auth.get<Hall[]>('/api/admins/' + provostID + '/halls/');
  }
}
