import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-confirm-attendance',
  template: `
    It works!
  `,
  styles: []
})
export class ConfirmAttendanceComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
    });
  }

  ngOnInit() {
  }
}
