import type { AuthSession } from "@/lib/api/types";

const sessionKey = "alumni_connect_session";
const tokenKey = "alumni_connect_token";

export function saveSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(sessionKey, JSON.stringify(session));
  window.localStorage.setItem(tokenKey, session.token);
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(sessionKey);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    window.localStorage.removeItem(sessionKey);
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(sessionKey);
  window.localStorage.removeItem(tokenKey);
}
