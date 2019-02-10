import {Injectable} from '@angular/core';
import {AdminUser, Student} from '../custom/interfaces';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  examChanged = new Subject();

  user: AdminUser;

  student: Student;

  constructor(private http: HttpClient) {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.student = JSON.parse(sessionStorage.getItem('student'));
  }

  get<T>(url): Observable<T> {
    return this.http.get<T>(url);
  }

  post<T>(url, data): Observable<T> {
    const token = this.user == null ? '' : this.user.token;
    return this.http.post<T>(url, data, {headers: {Authorization: 'JWT ' + token}});
  }

  patch<T>(url, data): Observable<T> {
    return this.http.patch<T>(url, data);
  }

  delete<T>(url): Observable<T> {
    return this.http.delete<T>(url);
  }

  loginStudent(data: { id: number; department: number; semester: number; }) {
    const req = this.get<Student>('/api/students/' + data.id + '/');
    req.subscribe(res => {
      if (data.department === res.department && data.semester === res.semester) {
        this.student = res;
        sessionStorage.setItem('student', JSON.stringify(this.student));
      }
    }, error1 => console.log(error1));
    return req;
  }

  loginAdmin(data: { username: string; password: string; }) {
    const req = this.post<{ token: string, user: any }>('/api/auth/obtain-jwt-token/', data);
    req.subscribe(
      res => {
        this.user = res.user;
        this.user.token = res.token;
        sessionStorage.setItem('user', JSON.stringify(this.user));
      });
    return req;
  }

  logoutStudent() {
    this.student = null;
    sessionStorage.removeItem('student');
  }

  logoutAdmin() {
    this.user = null;
    sessionStorage.removeItem('user');
  }
}
