export type Role = "admin" | "student" | "superadmin";

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  website?: string;
  bio?: string;
  role: Role;
  mustChangePassword?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface ExamType {
  id: string;
  name: string;
  description: string;
}

export interface ExamPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
}

export interface Exam {
  id: string;
  title: string;
  examTypeId: string;
  subjectId: string;
  periodId: string;
  date: string;
  time: string;
  duration: number; // minutes
  totalMarks: number;
  passingMarks: number;
  instructions: string;
  status: "scheduled" | "completed" | "results_published";
}

export interface Result {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  status: "pass" | "fail";
}

export interface Notification {
  id: string;
  type: "exam" | "result" | "general";
  title: string;
  message: string;
  target: "all" | string[]; // "all" or array of student IDs
  createdAt: string;
  read?: boolean;
}
