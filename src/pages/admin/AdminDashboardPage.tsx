import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Users, FileText, BarChart3 } from "lucide-react";

export default function AdminDashboardPage() {
  const { allUsers } = useAuth();
  const { exams, examTypes, subjects, results } = useData();

  const stats = [
    { label: "Total Exams", value: exams.length, icon: ClipboardList, color: "text-primary" },
    { label: "Exam Types", value: examTypes.length, icon: FileText, color: "text-accent" },
    { label: "Subjects", value: subjects.length, icon: BarChart3, color: "text-warning" },
    { label: "Students", value: allUsers.filter(u => u.role === "student").length, icon: Users, color: "text-destructive" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-muted ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Exams</CardTitle>
        </CardHeader>
        <CardContent>
          {exams.length === 0 ? (
            <p className="text-muted-foreground">No exams created yet.</p>
          ) : (
            <div className="space-y-3">
              {exams.slice(0, 5).map(exam => (
                <div key={exam.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <div className="font-medium text-foreground">{exam.title}</div>
                    <div className="text-sm text-muted-foreground">{exam.date} · {exam.time}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    exam.status === "results_published" ? "bg-accent/10 text-accent" :
                    exam.status === "completed" ? "bg-primary/10 text-primary" :
                    "bg-warning/10 text-warning"
                  }`}>
                    {exam.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
