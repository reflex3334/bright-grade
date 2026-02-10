import { User, ExamType, ExamPeriod, Subject, Exam, Result, Notification } from "@/types";

export const SUPER_ADMIN_CREDENTIALS = {
  username: "superadmin",
  password: "Super@123",
};

export const mockUsers: User[] = [
  {
    id: "admin-1",
    username: "admin",
    email: "admin@exam.com",
    displayName: "Admin User",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
  },
  {
    id: "admin-2",
    username: "admin2",
    email: "admin2@exam.com",
    displayName: "Second Admin",
    firstName: "Second",
    lastName: "Admin",
    role: "admin",
  },
  {
    id: "student-1",
    username: "john",
    email: "john@student.com",
    displayName: "John Doe",
    firstName: "John",
    lastName: "Doe",
    nickname: "JD",
    role: "student",
  },
  {
    id: "student-2",
    username: "jane",
    email: "jane@student.com",
    displayName: "Jane Smith",
    firstName: "Jane",
    lastName: "Smith",
    role: "student",
  },
  {
    id: "student-3",
    username: "bob",
    email: "bob@student.com",
    displayName: "Bob Wilson",
    firstName: "Bob",
    lastName: "Wilson",
    role: "student",
  },
];

export const mockPasswords: Record<string, string> = {
  admin: "Admin@123",
  admin2: "Admin@123",
  john: "Student@123",
  jane: "Student@123",
  bob: "Student@123",
};

export const mockExamTypes: ExamType[] = [
  { id: "et-1", name: "Theory", description: "Written theory examination" },
  { id: "et-2", name: "MCQ", description: "Multiple choice questions" },
  { id: "et-3", name: "Open-book", description: "Open-book examination with reference materials allowed" },
];

export const mockPeriods: ExamPeriod[] = [
  { id: "ep-1", name: "Semester I 2025", startDate: "2025-01-15", endDate: "2025-05-30" },
  { id: "ep-2", name: "Winter 2025", startDate: "2025-10-01", endDate: "2025-12-20" },
];

export const mockSubjects: Subject[] = [
  { id: "sub-1", name: "Mathematics", code: "MATH101", description: "Fundamentals of Mathematics" },
  { id: "sub-2", name: "Physics", code: "PHY101", description: "Introduction to Physics" },
  { id: "sub-3", name: "Computer Science", code: "CS101", description: "Intro to Computer Science" },
  { id: "sub-4", name: "English", code: "ENG101", description: "English Language & Literature" },
  { id: "sub-5", name: "Chemistry", code: "CHEM101", description: "Basic Chemistry" },
];

export const mockExams: Exam[] = [
  {
    id: "exam-1",
    title: "Mathematics Mid-Term",
    examTypeId: "et-1",
    subjectId: "sub-1",
    periodId: "ep-1",
    date: "2025-03-15",
    time: "09:00",
    duration: 120,
    totalMarks: 100,
    passingMarks: 40,
    instructions: "Answer all questions. Show all working.",
    status: "results_published",
  },
  {
    id: "exam-2",
    title: "Physics MCQ Test",
    examTypeId: "et-2",
    subjectId: "sub-2",
    periodId: "ep-1",
    date: "2025-03-20",
    time: "14:00",
    duration: 60,
    totalMarks: 50,
    passingMarks: 20,
    instructions: "Select the correct answer for each question.",
    status: "completed",
  },
  {
    id: "exam-3",
    title: "CS Open-book Final",
    examTypeId: "et-3",
    subjectId: "sub-3",
    periodId: "ep-1",
    date: "2025-05-10",
    time: "10:00",
    duration: 180,
    totalMarks: 100,
    passingMarks: 45,
    instructions: "Reference materials allowed. No internet access.",
    status: "scheduled",
  },
];

export const mockResults: Result[] = [
  { id: "r-1", examId: "exam-1", studentId: "student-1", studentName: "John Doe", totalMarks: 100, obtainedMarks: 78, percentage: 78, status: "pass" },
  { id: "r-2", examId: "exam-1", studentId: "student-2", studentName: "Jane Smith", totalMarks: 100, obtainedMarks: 92, percentage: 92, status: "pass" },
  { id: "r-3", examId: "exam-1", studentId: "student-3", studentName: "Bob Wilson", totalMarks: 100, obtainedMarks: 35, percentage: 35, status: "fail" },
];

export const mockNotifications: Notification[] = [
  {
    id: "n-1",
    type: "exam",
    title: "Upcoming Exam",
    message: "Mathematics Mid-Term is scheduled for March 15, 2025.",
    target: "all",
    createdAt: "2025-03-01T10:00:00Z",
  },
  {
    id: "n-2",
    type: "result",
    title: "Results Published",
    message: "Mathematics Mid-Term results have been published. Check your dashboard.",
    target: "all",
    createdAt: "2025-03-20T14:00:00Z",
  },
  {
    id: "n-3",
    type: "general",
    title: "Welcome",
    message: "Welcome to the Exam Management System!",
    target: "all",
    createdAt: "2025-01-01T00:00:00Z",
  },
];
