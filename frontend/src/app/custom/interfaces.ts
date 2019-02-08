export interface Department {
  id: number;
  name: string;
  alias: string;
  chairman: number;
  officer: number;
}

export interface Semester {
  id: number;
  number: number;
  year: number;
  department: number;
  courses: Course[];
}

export interface Department {
  id: number;
  name: string;
  alias: string;
  chairman: number;
  officer: number;
}

export interface AdminUser {
  user: number;
  type: string;
  token: string;
  name: string;
}

export interface Student {
  id: number;
  name: string;
  semester: number;
  hall: number;
  session: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  religion: string;
  address: string;
  department: number;
}

export interface Hall {
  id: number;
  name: string;
  provost: number;
  gender: string;
}

export interface Exam {
  id: number;
  title: string;
  semester: number;
  active: boolean;
  fees_per_credit: number;
  allowed_attendance: number;
  fined_attendance: number;
  attendance_fine: number;
  ldo_form_fill_up: string;
  ldo_payment: string;
  status: number;
  courses: Course[];
  applied: boolean;
}

export interface ExamForm {
  id: number;
  exam: number;
  student: number;
  status: number;
  attendance: number;
}

export interface Course {
  code: string;
  title: string;
  credits: number;
}
