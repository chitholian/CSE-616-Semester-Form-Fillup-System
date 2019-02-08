import {Injectable} from '@angular/core';
import {AdminUser, Student} from '../custom/interfaces';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  examChanged = new Subject();

  user: AdminUser = {
    name: 'CSE Chairman',
    type: 'chairman',
    user: 8,
    token: ''
  };

  student: Student = {
    id: 16701016,
    name: 'Atikur Rahman Chitholian',
    session: '2015 - 2016',
    gender: 'male',
    religion: 'islam',
    dob: '1997-08-20',
    phone: '01521446530',
    email: 'chitholian@gmail.com',
    address: 'Room 142, Shaheed Abdur Rab Hall',
    semester: 1,
    department: 1,
    hall: 1
  };

  constructor(private http: HttpClient) {
  }

  get<T>(url): Observable<T> {
    return this.http.get<T>(url);
  }

  post<T>(url, data): Observable<T> {
    const token = this.user == null ? '' : this.user.token;
    return this.http.post<T>(url, data, {headers: {Authorization: 'JWT ' + token}});
  }

  loginStudent(data: { id: number; department: number; semester: number; }) {
    const req = this.get<Student>('/api/students/' + data.id + '/');
    req.subscribe(res => {
      if (data.department === res.department && data.semester === res.semester) {
        this.student = res;
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
        console.log(this.user);
      });
    return req;
  }

  logoutStudent() {
    this.student = null;
  }

  logoutAdmin() {
    this.user = null;
  }
}
