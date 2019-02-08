import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {
  MatToolbarModule,
  MatTableModule,
  MatInputModule,
  MatListModule,
  MatSidenavModule,
  MatButtonModule,
  MatSelectModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatIconModule,
  MatOptionModule,
  MatSnackBarModule,
  MatProgressBarModule,
  MatFormFieldModule,
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatToolbarModule,
    MatTableModule,
    MatInputModule,
    MatDatepickerModule,
    MatListModule,
    MatSidenavModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatIconModule,
    MatOptionModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatFormFieldModule,
  ]
})
export class CustomModule {
}
