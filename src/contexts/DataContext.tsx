import React, { createContext, useContext, useState, useCallback } from "react";
import { ExamType, ExamPeriod, Subject, Exam, Result, Notification } from "@/types";
import { mockExamTypes, mockPeriods, mockSubjects, mockExams, mockResults, mockNotifications } from "@/data/mockData";

interface DataContextType {
  examTypes: ExamType[];
  periods: ExamPeriod[];
  subjects: Subject[];
  exams: Exam[];
  results: Result[];
  notifications: Notification[];
  addExamType: (et: ExamType) => void;
  updateExamType: (et: ExamType) => void;
  deleteExamType: (id: string) => void;
  addPeriod: (p: ExamPeriod) => void;
  updatePeriod: (p: ExamPeriod) => void;
  deletePeriod: (id: string) => void;
  addSubject: (s: Subject) => void;
  updateSubject: (s: Subject) => void;
  deleteSubject: (id: string) => void;
  addExam: (e: Exam) => void;
  updateExam: (e: Exam) => void;
  deleteExam: (id: string) => void;
  generateResults: (examId: string) => Promise<void>;
  addNotification: (n: Notification) => void;
  deleteNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [examTypes, setExamTypes] = useState<ExamType[]>(mockExamTypes);
  const [periods, setPeriods] = useState<ExamPeriod[]>(mockPeriods);
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [results, setResults] = useState<Result[]>(mockResults);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const addExamType = useCallback((et: ExamType) => setExamTypes(p => [...p, et]), []);
  const updateExamType = useCallback((et: ExamType) => setExamTypes(p => p.map(x => x.id === et.id ? et : x)), []);
  const deleteExamType = useCallback((id: string) => setExamTypes(p => p.filter(x => x.id !== id)), []);

  const addPeriod = useCallback((p: ExamPeriod) => setPeriods(prev => [...prev, p]), []);
  const updatePeriod = useCallback((p: ExamPeriod) => setPeriods(prev => prev.map(x => x.id === p.id ? p : x)), []);
  const deletePeriod = useCallback((id: string) => setPeriods(p => p.filter(x => x.id !== id)), []);

  const addSubject = useCallback((s: Subject) => setSubjects(p => [...p, s]), []);
  const updateSubject = useCallback((s: Subject) => setSubjects(p => p.map(x => x.id === s.id ? s : x)), []);
  const deleteSubject = useCallback((id: string) => setSubjects(p => p.filter(x => x.id !== id)), []);

  const addExam = useCallback((e: Exam) => setExams(p => [...p, e]), []);
  const updateExam = useCallback((e: Exam) => setExams(p => p.map(x => x.id === e.id ? e : x)), []);
  const deleteExam = useCallback((id: string) => setExams(p => p.filter(x => x.id !== id)), []);

  const generateResults = useCallback(async (examId: string) => {
    await new Promise(r => setTimeout(r, 2000)); // simulate backend
    const exam = exams.find(e => e.id === examId);
    if (!exam) return;
    const students = [
      { id: "student-1", name: "John Doe" },
      { id: "student-2", name: "Jane Smith" },
      { id: "student-3", name: "Bob Wilson" },
    ];
    const newResults: Result[] = students.map(s => {
      const obtained = Math.floor(Math.random() * (exam.totalMarks * 0.6)) + Math.floor(exam.totalMarks * 0.3);
      const pct = Math.round((obtained / exam.totalMarks) * 100);
      return {
        id: `r-${examId}-${s.id}-${Date.now()}`,
        examId,
        studentId: s.id,
        studentName: s.name,
        totalMarks: exam.totalMarks,
        obtainedMarks: obtained,
        percentage: pct,
        status: obtained >= exam.passingMarks ? "pass" : "fail",
      };
    });
    setResults(prev => [...prev.filter(r => r.examId !== examId), ...newResults]);
    setExams(prev => prev.map(e => e.id === examId ? { ...e, status: "results_published" as const } : e));
    setNotifications(prev => [...prev, {
      id: `n-${Date.now()}`,
      type: "result",
      title: "Results Published",
      message: `Results for "${exam.title}" have been published.`,
      target: "all",
      createdAt: new Date().toISOString(),
    }]);
  }, [exams]);

  const addNotification = useCallback((n: Notification) => setNotifications(p => [...p, n]), []);
  const deleteNotification = useCallback((id: string) => setNotifications(p => p.filter(x => x.id !== id)), []);
  const markNotificationRead = useCallback((id: string) => setNotifications(p => p.map(x => x.id === id ? { ...x, read: true } : x)), []);

  return (
    <DataContext.Provider value={{
      examTypes, periods, subjects, exams, results, notifications,
      addExamType, updateExamType, deleteExamType,
      addPeriod, updatePeriod, deletePeriod,
      addSubject, updateSubject, deleteSubject,
      addExam, updateExam, deleteExam,
      generateResults,
      addNotification, deleteNotification, markNotificationRead,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
