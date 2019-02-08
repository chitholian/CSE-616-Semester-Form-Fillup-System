import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";
import {Department, Hall} from "../custom/interfaces";
import {Observable} from "rxjs/internal/Observable";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private auth: AuthService) {
  }

  getDepartmentsOfChairman(chairmanId) {
    return this.auth.get<Department[]>('http://127.0.0.1:8000/api/admins/' + chairmanId + '/departments/');
  }
}
