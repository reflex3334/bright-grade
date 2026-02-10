import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, LogOut, Bell, ClipboardList, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const { exams, results, notifications, subjects, markNotificationRead } = useData();
  const navigate = useNavigate();

  if (!isAuthenticated || user?.role !== "student") return <Navigate to="/login" replace />;

  const studentResults = results.filter(r => r.studentId === user.id);
  const studentNotifications = notifications.filter(n => n.target === "all" || (Array.isArray(n.target) && n.target.includes(user.id)));
  const unreadCount = studentNotifications.filter(n => !n.read).length;

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">ExamManager</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full text-[10px] flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="text-sm text-foreground hidden sm:inline">Welcome, {user.firstName}!</span>
            <Button variant="outline" size="sm" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Student Dashboard</h1>

        {/* Assigned Exams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5 text-primary" /> Assigned Exams</CardTitle>
          </CardHeader>
          <CardContent>
            {exams.length === 0 ? <p className="text-muted-foreground">No exams assigned.</p> : (
              <div className="space-y-3">
                {exams.map(exam => (
                  <div key={exam.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <div className="font-medium text-foreground">{exam.title}</div>
                      <div className="text-sm text-muted-foreground">{subjects.find(s => s.id === exam.subjectId)?.name} · {exam.date} at {exam.time}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      exam.status === "results_published" ? "bg-accent/10 text-accent" :
                      exam.status === "completed" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"
                    }`}>{exam.status.replace("_", " ")}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-accent" /> My Results</CardTitle>
          </CardHeader>
          <CardContent>
            {studentResults.length === 0 ? <p className="text-muted-foreground">No results available yet.</p> : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Obtained</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentResults.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{exams.find(e => e.id === r.examId)?.title ?? r.examId}</TableCell>
                      <TableCell>{r.totalMarks}</TableCell>
                      <TableCell>{r.obtainedMarks}</TableCell>
                      <TableCell>{r.percentage}%</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${r.status === "pass" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
                          {r.status.toUpperCase()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-warning" /> Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            {studentNotifications.length === 0 ? <p className="text-muted-foreground">No notifications.</p> : (
              <div className="space-y-3">
                {[...studentNotifications].reverse().map(n => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${n.read ? "bg-background" : "bg-primary/5 border-primary/20"}`}
                    onClick={() => markNotificationRead(n.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-foreground">{n.title}</div>
                      <span className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
