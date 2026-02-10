import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Notification } from "@/types";
import { DataTable } from "@/components/DataTable";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Send } from "lucide-react";

export default function NotificationsPage() {
  const { notifications, addNotification, deleteNotification } = useData();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"exam" | "result" | "general">("general");

  const handlePublish = () => {
    if (!title.trim() || !message.trim()) { toast({ title: "Title and message required.", variant: "destructive" }); return; }
    addNotification({
      id: `n-${Date.now()}`,
      type,
      title: title.trim(),
      message: message.trim(),
      target: "all",
      createdAt: new Date().toISOString(),
    });
    toast({ title: "Notification published." });
    setShowForm(false);
    setTitle(""); setMessage("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        <Button onClick={() => setShowForm(true)}><Plus className="mr-2 h-4 w-4" /> Create Notification</Button>
      </div>

      <DataTable
        data={[...notifications].reverse()}
        columns={[
          { key: "type", label: "Type", render: n => <span className="capitalize">{n.type}</span> },
          { key: "title", label: "Title" },
          { key: "message", label: "Message" },
          { key: "createdAt", label: "Created", render: n => new Date(n.createdAt).toLocaleDateString() },
        ]}
        searchKeys={["title", "message"]}
        actions={item => (
          <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        )}
      />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Notification</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={v => setType(v as any)}>
                <SelectTrigger className="bg-popover"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="result">Result</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Title *</Label><Input value={title} onChange={e => setTitle(e.target.value)} /></div>
            <div className="space-y-2"><Label>Message *</Label><Textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} /></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={handlePublish}><Send className="mr-2 h-4 w-4" /> Publish</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Notification" description="Are you sure?" onConfirm={() => { if (deleteId) { deleteNotification(deleteId); toast({ title: "Notification deleted." }); setDeleteId(null); } }} confirmLabel="Delete" variant="destructive" />
    </div>
  );
}
