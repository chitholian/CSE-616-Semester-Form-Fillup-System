import {Injectable} from '@angular/core';
import {AdminUser, Student} from '../custom/interfaces';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: AdminUser;
  student: Student;

  constructor(private http: HttpClient) {
  }

  get<T>(url): Observable<T> {
    return this.http.get<T>(url);
  }

  post<T>(url, data): Observable<T> {
    return this.http.post<T>(url, data, {headers: {}});
  }

  loginStudent(data: { id: number; department: number; semester: number; }) {
    const req = this.get<Student>('/api/students/' + data.id + '/');
    req.subscribe(res => this.student = res, error1 => console.log(error1));
    return req;
  }

  loginAdmin(data: { username: string; password: string; type: string; }) {
    const req = this.post<AdminUser>('/api/auth/login/', data);
    req.subscribe(res => this.user = res, error1 => console.log(error1));
    return req;
  }

  logoutStudent() {
    this.student = null;
  }

  logoutAdmin() {
    this.user = null;
  }
}
