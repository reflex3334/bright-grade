import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Exam } from "@/types";
import { DataTable } from "@/components/DataTable";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

const emptyExam = { title: "", examTypeId: "", subjectId: "", periodId: "", date: "", time: "", duration: 60, totalMarks: 100, passingMarks: 40, instructions: "" };

export default function ExamsPage() {
  const { exams, examTypes, subjects, periods, addExam, updateExam, deleteExam } = useData();
  const { toast } = useToast();
  const [editItem, setEditItem] = useState<Exam | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyExam);
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const openAdd = () => { setEditItem(null); setForm(emptyExam); setShowForm(true); };
  const openEdit = (e: Exam) => { setEditItem(e); setForm({ title: e.title, examTypeId: e.examTypeId, subjectId: e.subjectId, periodId: e.periodId, date: e.date, time: e.time, duration: e.duration, totalMarks: e.totalMarks, passingMarks: e.passingMarks, instructions: e.instructions }); setShowForm(true); };

  const handleSave = () => {
    if (!form.title.trim() || !form.examTypeId || !form.subjectId || !form.periodId || !form.date || !form.time) {
      toast({ title: "Please fill all required fields.", variant: "destructive" }); return;
    }
    if (editItem) {
      updateExam({ ...editItem, ...form, title: form.title.trim(), instructions: form.instructions.trim() });
      toast({ title: "Exam updated." });
    } else {
      addExam({ id: `exam-${Date.now()}`, ...form, title: form.title.trim(), instructions: form.instructions.trim(), status: "scheduled" });
      toast({ title: "Exam created." });
    }
    setShowForm(false);
  };

  const getTypeName = (id: string) => examTypes.find(t => t.id === id)?.name ?? id;
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name ?? id;
  const getPeriodName = (id: string) => periods.find(p => p.id === id)?.name ?? id;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Exams</h1>
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Create Exam</Button>
      </div>

      <DataTable
        data={exams}
        columns={[
          { key: "title", label: "Title" },
          { key: "examTypeId", label: "Type", render: e => getTypeName(e.examTypeId) },
          { key: "subjectId", label: "Subject", render: e => getSubjectName(e.subjectId) },
          { key: "date", label: "Date" },
          { key: "status", label: "Status", render: e => (
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              e.status === "results_published" ? "bg-accent/10 text-accent" :
              e.status === "completed" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"
            }`}>{e.status.replace("_", " ")}</span>
          )},
        ]}
        searchKeys={["title"]}
        actions={item => (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        )}
      />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editItem ? "Edit Exam" : "Create Exam"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Title *</Label><Input value={form.title} onChange={e => set("title", e.target.value)} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select value={form.examTypeId} onValueChange={v => set("examTypeId", v)}>
                  <SelectTrigger className="bg-popover"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="bg-popover z-50">{examTypes.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Select value={form.subjectId} onValueChange={v => set("subjectId", v)}>
                  <SelectTrigger className="bg-popover"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="bg-popover z-50">{subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Period *</Label>
                <Select value={form.periodId} onValueChange={v => set("periodId", v)}>
                  <SelectTrigger className="bg-popover"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="bg-popover z-50">{periods.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Date *</Label><Input type="date" value={form.date} onChange={e => set("date", e.target.value)} /></div>
              <div className="space-y-2"><Label>Time *</Label><Input type="time" value={form.time} onChange={e => set("time", e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2"><Label>Duration (min)</Label><Input type="number" value={form.duration} onChange={e => set("duration", +e.target.value)} /></div>
              <div className="space-y-2"><Label>Total Marks</Label><Input type="number" value={form.totalMarks} onChange={e => set("totalMarks", +e.target.value)} /></div>
              <div className="space-y-2"><Label>Passing Marks</Label><Input type="number" value={form.passingMarks} onChange={e => set("passingMarks", +e.target.value)} /></div>
            </div>
            <div className="space-y-2"><Label>Instructions</Label><Textarea value={form.instructions} onChange={e => set("instructions", e.target.value)} /></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Exam" description="Are you sure?" onConfirm={() => { if (deleteId) { deleteExam(deleteId); toast({ title: "Exam deleted." }); setDeleteId(null); } }} confirmLabel="Delete" variant="destructive" />
    </div>
  );
}
