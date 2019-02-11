import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {Department} from '../custom/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private auth: AuthService) {
  }

  getDepartmentsOfChairman(chairmanId) {
    return this.auth.get<Department[]>('/api/admins/' + chairmanId + '/departments/');
  }
}
