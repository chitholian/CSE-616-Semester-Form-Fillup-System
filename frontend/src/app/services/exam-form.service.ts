import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExamFormService {

  constructor(private auth: AuthService) {
  }

  patch(form) {
    return this.auth.patch('/api/exam-forms/' + form.id + '/', form);
  }
}
