import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { User, AuthState, Role } from "@/types";
import { mockUsers, mockPasswords, SUPER_ADMIN_CREDENTIALS } from "@/data/mockData";

interface AuthContextType extends AuthState {
  login: (username: string, password: string, role: Role) => Promise<{ success: boolean; error?: string }>;
  register: (userData: Partial<User> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  verifySuperAdmin: (username: string, password: string) => boolean;
  createAdmin: (username: string, email: string, tempPassword: string) => Promise<{ success: boolean; error?: string }>;
  forceChangePassword: (newPassword: string) => void;
  allUsers: User[];
  addUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const stored = localStorage.getItem("exam_auth");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { user: null, token: null, isAuthenticated: false };
      }
    }
    return { user: null, token: null, isAuthenticated: false };
  });

  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem("exam_users");
    if (stored) {
      try { return JSON.parse(stored); } catch { return [...mockUsers]; }
    }
    return [...mockUsers];
  });

  const [passwords, setPasswords] = useState<Record<string, string>>(() => {
    const stored = localStorage.getItem("exam_passwords");
    if (stored) {
      try { return JSON.parse(stored); } catch { return { ...mockPasswords }; }
    }
    return { ...mockPasswords };
  });

  useEffect(() => {
    localStorage.setItem("exam_auth", JSON.stringify(authState));
  }, [authState]);

  useEffect(() => {
    localStorage.setItem("exam_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("exam_passwords", JSON.stringify(passwords));
  }, [passwords]);

  const login = useCallback(async (username: string, password: string, role: Role): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 500));
    const user = users.find(u => u.username === username && u.role === role);
    if (!user) return { success: false, error: "Invalid username or role." };
    if (passwords[username] !== password) return { success: false, error: "Invalid password." };
    const token = `mock-token-${user.id}-${Date.now()}`;
    setAuthState({ user, token, isAuthenticated: true });
    return { success: true };
  }, [users, passwords]);

  const register = useCallback(async (userData: Partial<User> & { password: string }): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 500));
    if (users.find(u => u.username === userData.username)) {
      return { success: false, error: "Username already exists." };
    }
    const newUser: User = {
      id: `student-${Date.now()}`,
      username: userData.username!,
      email: userData.email!,
      displayName: userData.displayName || `${userData.firstName} ${userData.lastName}`,
      firstName: userData.firstName!,
      lastName: userData.lastName!,
      nickname: userData.nickname,
      website: userData.website,
      bio: userData.bio,
      role: "student",
    };
    setUsers(prev => [...prev, newUser]);
    setPasswords(prev => ({ ...prev, [newUser.username]: userData.password }));
    const token = `mock-token-${newUser.id}-${Date.now()}`;
    setAuthState({ user: newUser, token, isAuthenticated: true });
    return { success: true };
  }, [users]);

  const logout = useCallback(() => {
    setAuthState({ user: null, token: null, isAuthenticated: false });
    localStorage.removeItem("exam_auth");
  }, []);

  const verifySuperAdmin = useCallback((username: string, password: string): boolean => {
    return username === SUPER_ADMIN_CREDENTIALS.username && password === SUPER_ADMIN_CREDENTIALS.password;
  }, []);

  const createAdmin = useCallback(async (username: string, email: string, tempPassword: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 500));
    if (users.find(u => u.username === username)) {
      return { success: false, error: "Username already exists." };
    }
    const newAdmin: User = {
      id: `admin-${Date.now()}`,
      username,
      email,
      displayName: username,
      firstName: username,
      lastName: "Admin",
      role: "admin",
      mustChangePassword: true,
    };
    setUsers(prev => [...prev, newAdmin]);
    setPasswords(prev => ({ ...prev, [username]: tempPassword }));
    return { success: true };
  }, [users]);

  const forceChangePassword = useCallback((newPassword: string) => {
    if (authState.user) {
      setPasswords(prev => ({ ...prev, [authState.user!.username]: newPassword }));
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, mustChangePassword: false } : null,
      }));
    }
  }, [authState.user]);

  const addUser = useCallback((user: User) => {
    setUsers(prev => [...prev, user]);
  }, []);

  return (
    <AuthContext.Provider value={{
      ...authState,
      login, register, logout, verifySuperAdmin, createAdmin,
      forceChangePassword, allUsers: users, addUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
