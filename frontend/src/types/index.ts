export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: number;
  joinDate: string;
  isActive: boolean;
}

export interface Attendance {
  id: number;
  employeeId: number;
  employee?: Employee;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half-Day';
}

export interface AuthUser {
  token: string;
  username: string;
  role: string;
}

export interface Stats {
  total: number;
  active: number;
  inactive: number;
  deptCounts: { department: string; count: number }[];
  avgSalary: number;
}
