import { useState } from "react";
import { Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  BookOpen, LayoutDashboard, FileText, Clock, BookMarked, ClipboardList,
  BarChart3, Bell, Users, LogOut, Menu, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "@/components/NavLink";

const sidebarItems = [
  { title: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { title: "Exam Types", path: "/admin/exam-types", icon: FileText },
  { title: "Exam Periods", path: "/admin/periods", icon: Clock },
  { title: "Subjects", path: "/admin/subjects", icon: BookMarked },
  { title: "Exams", path: "/admin/exams", icon: ClipboardList },
  { title: "Results", path: "/admin/results", icon: BarChart3 },
  { title: "Notifications", path: "/admin/notifications", icon: Bell },
  { title: "User Management", path: "/admin/users", icon: Users },
];

export default function AdminLayout() {
  const { user, isAuthenticated, logout, forceChangePassword } = useAuth();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  if (!isAuthenticated || user?.role !== "admin") return <Navigate to="/login" replace />;

  // Force password change
  if (user?.mustChangePassword) {
    return <ForceChangePassword onSubmit={forceChangePassword} />;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Mobile overlay */}
      {sideOpen && <div className="fixed inset-0 bg-foreground/20 z-30 lg:hidden" onClick={() => setSideOpen(false)} />}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform lg:translate-x-0",
        sideOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 flex items-center gap-2 border-b border-sidebar-border">
          <BookOpen className="h-6 w-6" />
          <span className="text-lg font-bold">ExamManager</span>
          <button className="ml-auto lg:hidden" onClick={() => setSideOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              onClick={() => setSideOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <div className="px-3 py-2 text-sm">
            <div className="font-medium">{user?.displayName}</div>
            <div className="text-xs opacity-70">{user?.role}</div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 h-14 border-b bg-background/95 backdrop-blur flex items-center px-4 gap-4">
          <button className="lg:hidden" onClick={() => setSideOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">Admin Dashboard</h2>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function ForceChangePassword({ onSubmit }: { onSubmit: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (pw !== confirm) { setError("Passwords do not match."); return; }
    onSubmit(pw);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Change Your Password</CardTitle>
          <CardDescription>You must change your temporary password before continuing.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
          <form onSubmit={handle} className="space-y-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" value={pw} onChange={e => setPw(e.target.value)} required minLength={6} />
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">Update Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
