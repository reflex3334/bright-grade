import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Loader2 } from "lucide-react";

export default function ResultsPage() {
  const { exams, results, generateResults, subjects } = useData();
  const { toast } = useToast();
  const [genExamId, setGenExamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewExamId, setViewExamId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!genExamId) return;
    setLoading(true);
    await generateResults(genExamId);
    setLoading(false);
    toast({ title: "Results published successfully." });
    setGenExamId(null);
    setViewExamId(genExamId);
  };

  const examResults = viewExamId ? results.filter(r => r.examId === viewExamId) : [];
  const getSubject = (id: string) => subjects.find(s => s.id === id)?.name ?? "";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Results</h1>

      <div className="grid gap-4">
        {exams.map(exam => (
          <Card key={exam.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">{exam.title}</div>
                <div className="text-sm text-muted-foreground">{getSubject(exam.subjectId)} · {exam.date}</div>
              </div>
              <div className="flex gap-2">
                {exam.status === "results_published" ? (
                  <Button variant="outline" onClick={() => setViewExamId(exam.id)}>
                    <BarChart3 className="mr-2 h-4 w-4" /> View Results
                  </Button>
                ) : exam.status === "completed" ? (
                  <Button onClick={() => setGenExamId(exam.id)}>
                    Generate / Publish Results
                  </Button>
                ) : (
                  <span className="text-sm text-muted-foreground px-3 py-2">Scheduled</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {viewExamId && examResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Results — {exams.find(e => e.id === viewExamId)?.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Total Marks</TableHead>
                  <TableHead>Obtained</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {examResults.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.studentName}</TableCell>
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
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={!!genExamId && !loading}
        onOpenChange={() => setGenExamId(null)}
        title="Generate & Publish Results"
        description={`Generate and publish results for "${exams.find(e => e.id === genExamId)?.title}"? This runs backend calculations and publishes results.`}
        onConfirm={handleGenerate}
        confirmLabel="Confirm"
      />

      {loading && (
        <div className="fixed inset-0 bg-foreground/20 flex items-center justify-center z-50">
          <Card className="p-8 text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-foreground font-medium">Generating results...</p>
            <p className="text-sm text-muted-foreground">Backend is calculating marks, percentage, and pass/fail.</p>
          </Card>
        </div>
      )}
    </div>
  );
}
