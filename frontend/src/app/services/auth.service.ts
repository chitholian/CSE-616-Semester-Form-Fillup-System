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

  private getAuthHeader() {
  }
}
