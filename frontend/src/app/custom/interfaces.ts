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
}

export interface Hall {
  id: number;
  name: string;
  provost: number;
  gender: string;
}
