"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

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
  user: AuthUser;
  role: UserRole;
  setUser: (user: AuthUser) => void;
  signOut: () => void;
  login: (email: string, password: string, role?: UserRole) => void;
  register: (name: string, email: string, password: string, role?: UserRole) => void;
};

const STORAGE_KEY = "alumnia_auth_user";

const defaultUser: AuthUser = {
  name: "Ava Mitchell",
  email: "ava.mitchell@alumnia.edu",
  role: "student",
  initials: "AM",
  classYear: "2025",
  department: "Computer Science",
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

function inferRole(email: string, explicit?: UserRole): UserRole {
  if (explicit) return explicit;
  const value = email.toLowerCase();
  if (value.includes("admin")) return "admin";
  if (value.includes("faculty")) return "faculty";
  if (value.includes("alumni") || value.includes("alum")) return "alumni";
  return "student";
}

function profileForRole(role: UserRole, name: string, email: string): AuthUser {
  if (role === "alumni") {
    return { name, email, role, initials: getInitials(name), classYear: "2018", department: "Product Design" };
  }
  if (role === "faculty") {
    return { name, email, role, initials: getInitials(name), classYear: "Faculty", department: "Career Services" };
  }
  if (role === "admin") {
    return { name, email, role, initials: getInitials(name), classYear: "Admin", department: "Network Operations" };
  }
  return { name, email, role, initials: getInitials(name), classYear: "2025", department: "Computer Science" };
}

function loadUser(): AuthUser {
  if (typeof window === "undefined") return defaultUser;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultUser;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return defaultUser;
  }
}

function saveUser(user: AuthUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function clearUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser>(defaultUser);

  useEffect(() => {
    setUserState(loadUser());
  }, []);

  const setUser = useCallback((next: AuthUser) => {
    setUserState(next);
    saveUser(next);
  }, []);

  const signOut = useCallback(() => {
    const guest: AuthUser = { ...defaultUser };
    setUserState(guest);
    clearUser();
  }, []);

  const login = useCallback(
    (email: string, _password: string, role?: UserRole) => {
      const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      setUser(profileForRole(inferRole(email, role), name, email));
    },
    [setUser],
  );

  const register = useCallback(
    (name: string, email: string, _password: string, role?: UserRole) => {
      setUser(profileForRole(inferRole(email, role), name, email));
    },
    [setUser],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, role: user.role, setUser, signOut, login, register }),
    [user, setUser, signOut, login, register],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
