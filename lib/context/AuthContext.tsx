"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSession, saveSession, clearSession } from "@/lib/auth";
import type { AuthSession } from "@/lib/api/types";

export type UserRole = "student" | "alumni" | "admin" | "faculty";

export type AuthUser = {
  name: string;
  email: string;
  role: UserRole;
  initials: string;
  classYear: string;
  department: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  role: UserRole;
  setUser: (user: AuthUser) => void;
  setSession: (session: AuthSession) => void;
  switchRole: (role: UserRole) => void;
  signOut: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function mapRole(apiRole?: string): UserRole {
  switch (apiRole?.toLowerCase()) {
    case "admin":
      return "admin";
    case "faculty":
      return "faculty";
    case "alumni":
      return "alumni";
    default:
      return "student";
  }
}

function userFromSession(session: AuthSession): AuthUser {
  const u = session.user;
  const role = mapRole(u.role);
  const name = u.name || u.email.split("@")[0].replace(/[._]/g, " ");
  return {
    name,
    email: u.email,
    role,
    initials: getInitials(name),
    classYear: u.alumni?.graduationYear?.toString() ?? u.batchYear?.toString() ?? "2025",
    department: u.alumni?.department ?? u.department ?? "Computer Science",
  };
}

function loadSessionUser(): AuthUser | null {
  const session = getSession();
  if (!session) return null;
  try {
    return userFromSession(session);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUserState(loadSessionUser());
    setLoading(false);
  }, []);

  const setUser = useCallback((next: AuthUser) => {
    setUserState(next);
    const session = getSession();
    if (session) {
      saveSession({ ...session, user: { ...session.user, name: next.name, email: next.email } });
    }
  }, []);

  const setSession = useCallback((session: AuthSession) => {
    saveSession(session);
    setUserState(userFromSession(session));
  }, []);

  const switchRole = useCallback((next: UserRole) => {
    setUserState((prev) => {
      if (!prev) return prev;
      const nextUser: AuthUser = { ...prev, role: next };
      const session = getSession();
      if (session) {
        saveSession({
          ...session,
          user: { ...session.user, role: next.toUpperCase() as AuthSession["user"]["role"] },
        });
      }
      return nextUser;
    });
  }, []);

  const signOut = useCallback(() => {
    setUserState(null);
    clearSession();
  }, []);

  useEffect(() => {
    function handleAuthExpired() {
      signOut();
    }
    window.addEventListener("auth-expired", handleAuthExpired);
    return () => window.removeEventListener("auth-expired", handleAuthExpired);
  }, [signOut]);

  const role = user?.role ?? "student";

  const value = useMemo<AuthContextValue>(
    () => ({ user, role, setUser, setSession, switchRole, signOut, loading }),
    [user, role, setUser, setSession, switchRole, signOut, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
