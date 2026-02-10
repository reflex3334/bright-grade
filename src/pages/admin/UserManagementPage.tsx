import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";

export default function UserManagementPage() {
  const { allUsers, verifySuperAdmin, createAdmin } = useAuth();
  const { toast } = useToast();
  const [showPopup, setShowPopup] = useState(false);
  const [step, setStep] = useState<"verify" | "create">("verify");
  const [saUser, setSaUser] = useState("");
  const [saPass, setSaPass] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [newUser, setNewUser] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [creating, setCreating] = useState(false);

  const openAddAdmin = () => {
    setStep("verify"); setSaUser(""); setSaPass(""); setVerifyError("");
    setNewUser(""); setNewEmail(""); setNewPass("");
    setShowPopup(true);
  };

  const handleVerify = () => {
    if (verifySuperAdmin(saUser, saPass)) {
      setStep("create"); setVerifyError("");
    } else {
      setVerifyError("Invalid Super Admin credentials.");
    }
  };

  const handleCreate = async () => {
    if (!newUser.trim() || !newPass.trim()) { toast({ title: "Username and password required.", variant: "destructive" }); return; }
    setCreating(true);
    const result = await createAdmin(newUser.trim(), newEmail.trim(), newPass);
    setCreating(false);
    if (result.success) {
      toast({ title: "Admin account created. Temporary password sent." });
      setShowPopup(false);
    } else {
      toast({ title: result.error || "Failed.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <Button onClick={openAddAdmin}><UserPlus className="mr-2 h-4 w-4" /> Add Admin</Button>
      </div>

      <DataTable
        data={allUsers}
        columns={[
          { key: "username", label: "Username" },
          { key: "displayName", label: "Display Name" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role", render: u => (
            <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${u.role === "admin" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
              {u.role}
            </span>
          )},
        ]}
        searchKeys={["username", "displayName", "email"]}
      />

      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent>
          {step === "verify" ? (
            <>
              <DialogHeader>
                <DialogTitle>Verify Super Admin</DialogTitle>
                <DialogDescription>Enter Super Admin credentials to proceed.</DialogDescription>
              </DialogHeader>
              {verifyError && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4" /> {verifyError}
                </div>
              )}
              <div className="space-y-4">
                <div className="space-y-2"><Label>Super Admin Username</Label><Input value={saUser} onChange={e => setSaUser(e.target.value)} /></div>
                <div className="space-y-2"><Label>Super Admin Password</Label><Input type="password" value={saPass} onChange={e => setSaPass(e.target.value)} /></div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowPopup(false)}>Cancel</Button>
                  <Button onClick={handleVerify}>Verify</Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Create Admin Account</DialogTitle>
                <DialogDescription>
                  <span className="flex items-center gap-1 text-accent"><CheckCircle2 className="h-4 w-4" /> Super Admin verified</span>
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Username *</Label><Input value={newUser} onChange={e => setNewUser(e.target.value)} /></div>
                <div className="space-y-2"><Label>Email</Label><Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} /></div>
                <div className="space-y-2"><Label>Temporary Password *</Label><Input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} /></div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowPopup(false)}>Cancel</Button>
                  <Button onClick={handleCreate} disabled={creating}>{creating ? "Creating..." : "Create Admin"}</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
