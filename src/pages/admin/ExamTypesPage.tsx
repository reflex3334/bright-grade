import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { ExamType } from "@/types";
import { DataTable } from "@/components/DataTable";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function ExamTypesPage() {
  const { examTypes, addExamType, updateExamType, deleteExamType } = useData();
  const { toast } = useToast();
  const [editItem, setEditItem] = useState<ExamType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const openAdd = () => { setEditItem(null); setName(""); setDesc(""); setShowForm(true); };
  const openEdit = (et: ExamType) => { setEditItem(et); setName(et.name); setDesc(et.description); setShowForm(true); };

  const handleSave = () => {
    if (!name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    if (editItem) {
      updateExamType({ ...editItem, name: name.trim(), description: desc.trim() });
      toast({ title: "Exam type updated." });
    } else {
      addExamType({ id: `et-${Date.now()}`, name: name.trim(), description: desc.trim() });
      toast({ title: "Exam type added." });
    }
    setShowForm(false);
  };

  const handleDelete = () => {
    if (deleteId) { deleteExamType(deleteId); toast({ title: "Exam type deleted." }); setDeleteId(null); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Exam Types</h1>
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Add Type</Button>
      </div>

      <DataTable
        data={examTypes}
        columns={[
          { key: "name", label: "Name" },
          { key: "description", label: "Description" },
        ]}
        searchKeys={["name", "description"]}
        actions={item => (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        )}
      />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Exam Type" : "Add Exam Type"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Name *</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={desc} onChange={e => setDesc(e.target.value)} /></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Exam Type" description="Are you sure you want to delete this exam type?" onConfirm={handleDelete} confirmLabel="Delete" variant="destructive" />
    </div>
  );
}
