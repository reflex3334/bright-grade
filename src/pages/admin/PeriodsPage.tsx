import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { ExamPeriod } from "@/types";
import { DataTable } from "@/components/DataTable";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function PeriodsPage() {
  const { periods, addPeriod, updatePeriod, deletePeriod } = useData();
  const { toast } = useToast();
  const [editItem, setEditItem] = useState<ExamPeriod | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const openAdd = () => { setEditItem(null); setName(""); setStartDate(""); setEndDate(""); setShowForm(true); };
  const openEdit = (p: ExamPeriod) => { setEditItem(p); setName(p.name); setStartDate(p.startDate); setEndDate(p.endDate); setShowForm(true); };

  const handleSave = () => {
    if (!name.trim() || !startDate || !endDate) { toast({ title: "All fields are required.", variant: "destructive" }); return; }
    if (editItem) {
      updatePeriod({ ...editItem, name: name.trim(), startDate, endDate });
      toast({ title: "Period updated." });
    } else {
      addPeriod({ id: `ep-${Date.now()}`, name: name.trim(), startDate, endDate });
      toast({ title: "Period added." });
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Exam Periods</h1>
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Add Period</Button>
      </div>

      <DataTable
        data={periods}
        columns={[
          { key: "name", label: "Period Name" },
          { key: "startDate", label: "Start Date" },
          { key: "endDate", label: "End Date" },
        ]}
        searchKeys={["name"]}
        actions={item => (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        )}
      />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editItem ? "Edit Period" : "Add Period"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Name *</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Start Date *</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
              <div className="space-y-2"><Label>End Date *</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Period" description="Are you sure?" onConfirm={() => { if (deleteId) { deletePeriod(deleteId); toast({ title: "Period deleted." }); setDeleteId(null); } }} confirmLabel="Delete" variant="destructive" />
    </div>
  );
}
