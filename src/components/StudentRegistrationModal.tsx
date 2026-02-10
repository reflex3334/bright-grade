import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentRegistrationModal({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: "", email: "", password: "", confirmPassword: "",
    displayName: "", firstName: "", lastName: "",
    nickname: "", website: "", bio: "",
  });

  const set = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const isValid = form.username && form.email && form.password && form.confirmPassword
    && form.firstName && form.lastName && form.password === form.confirmPassword && form.password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const result = await register({
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      displayName: form.displayName || `${form.firstName} ${form.lastName}`,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      nickname: form.nickname || undefined,
      website: form.website || undefined,
      bio: form.bio || undefined,
    });
    setLoading(false);
    if (result.success) {
      toast({ title: "Registration successful!", description: "Welcome to ExamManager." });
      onOpenChange(false);
      navigate("/student");
    } else {
      setError(result.error || "Registration failed.");
    }
  };

  const hasData = Object.values(form).some(v => v.length > 0);

  const handleClose = (val: boolean) => {
    if (!val && hasData) {
      if (window.confirm("You have unsaved data. Discard?")) {
        setForm({ username: "", email: "", password: "", confirmPassword: "", displayName: "", firstName: "", lastName: "", nickname: "", website: "", bio: "" });
        setError("");
        onOpenChange(false);
      }
    } else {
      onOpenChange(val);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Registration</DialogTitle>
          <DialogDescription>Create your student account to get started</DialogDescription>
        </DialogHeader>
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="reg-username">Username *</Label>
              <Input id="reg-username" value={form.username} onChange={e => set("username", e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="reg-email">Email *</Label>
              <Input id="reg-email" type="email" value={form.email} onChange={e => set("email", e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="reg-password">Password *</Label>
              <Input id="reg-password" type="password" value={form.password} onChange={e => set("password", e.target.value)} required minLength={6} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="reg-confirm">Confirm Password *</Label>
              <Input id="reg-confirm" type="password" value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} required />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="reg-display">Display Name</Label>
            <Input id="reg-display" value={form.displayName} onChange={e => set("displayName", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="reg-first">First Name *</Label>
              <Input id="reg-first" value={form.firstName} onChange={e => set("firstName", e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="reg-last">Last Name *</Label>
              <Input id="reg-last" value={form.lastName} onChange={e => set("lastName", e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="reg-nick">Nickname</Label>
              <Input id="reg-nick" value={form.nickname} onChange={e => set("nickname", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="reg-web">Website</Label>
              <Input id="reg-web" value={form.website} onChange={e => set("website", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="reg-bio">Bio</Label>
            <Textarea id="reg-bio" value={form.bio} onChange={e => set("bio", e.target.value)} rows={3} />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={!isValid || loading}>
            {loading ? "Creating account..." : "CREATE AND ACCESS"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
