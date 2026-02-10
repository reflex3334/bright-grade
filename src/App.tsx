import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ExamTypesPage from "./pages/admin/ExamTypesPage";
import PeriodsPage from "./pages/admin/PeriodsPage";
import SubjectsPage from "./pages/admin/SubjectsPage";
import ExamsPage from "./pages/admin/ExamsPage";
import ResultsPage from "./pages/admin/ResultsPage";
import NotificationsPage from "./pages/admin/NotificationsPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="exam-types" element={<ExamTypesPage />} />
                <Route path="periods" element={<PeriodsPage />} />
                <Route path="subjects" element={<SubjectsPage />} />
                <Route path="exams" element={<ExamsPage />} />
                <Route path="results" element={<ResultsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="users" element={<UserManagementPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
