import { apiFetch } from "@/lib/api";
import type { AdminMetrics, Alumni, AuthSession, EventItem, Job, LoginInput, ReferralRequest, RegisterInput, User } from "./types";

export const apiClient = {
  auth: {
    login: (input: LoginInput) => apiFetch<AuthSession>({ method: "POST", url: "/auth/login", data: input }),
    register: (input: RegisterInput) => apiFetch<AuthSession>({ method: "POST", url: "/auth/register", data: input }),
    me: () => apiFetch<User>({ method: "GET", url: "/users/me" }),
  },
  alumni: {
    list: (query?: string, options?: { filter?: string | null; value?: string | null }) => {
      const params: Record<string, string> = {};
      if (query) params.q = query;
      if (options?.filter && options?.value) {
        params.filter = options.filter;
        params.filterValue = options.value;
      }
      return apiFetch<Alumni[]>({ method: "GET", url: "/alumni", params: Object.keys(params).length > 0 ? params : undefined });
    },
    get: (id: string) => apiFetch<Alumni>({ method: "GET", url: `/alumni/${id}` }),
  },
  jobs: {
    list: () => apiFetch<Job[]>({ method: "GET", url: "/jobs" }),
    get: (id: string) => apiFetch<Job>({ method: "GET", url: `/jobs/${id}` }),
  },
  events: {
    list: () => apiFetch<EventItem[]>({ method: "GET", url: "/events" }),
    get: (id: string) => apiFetch<EventItem>({ method: "GET", url: `/events/${id}` }),
    rsvp: (id: string) => apiFetch<{ attending: boolean }>({ method: "POST", url: `/events/${id}/rsvp` }),
  },
  requests: {
    list: () => apiFetch<ReferralRequest[]>({ method: "GET", url: "/referrals" }),
    create: (jobId: string, message: string) => apiFetch<ReferralRequest>({ method: "POST", url: "/referrals", data: { jobId, message } }),
    updateStatus: (id: string, status: ReferralRequest["status"]) => apiFetch<ReferralRequest>({ method: "PATCH", url: `/referrals/${id}/status`, data: { status } }),
  },
  admin: {
    stats: () => apiFetch<any>({ method: "GET", url: "/admin/stats" }),
  },
  stories: {
    list: () => apiFetch<any[]>({ method: "GET", url: "/stories" }),
    create: (data: any) => apiFetch<any>({ method: "POST", url: "/stories", data }),
    updateStatus: (id: string, isApproved: boolean) => apiFetch<any>({ method: "PATCH", url: `/stories/${id}/approve`, data: { isApproved } }),
  },
  announcements: {
    list: () => apiFetch<any[]>({ method: "GET", url: "/announcements" }),
  },
  matching: {
    topAlumni: () => apiFetch<{ student: any; alumni: any[] }>({ method: "GET", url: "/matching/top-alumni" }),
  },
  mentorship: {
    list: () => apiFetch<{ mentorships: any[] }>({ method: "GET", url: "/mentorship" }),
    create: (data: { mentorId: string; area: string; message?: string }) => apiFetch<{ mentorship: any }>({ method: "POST", url: "/mentorship", data }),
    updateStatus: (id: string, status: string) => apiFetch<{ mentorship: any }>({ method: "PATCH", url: `/mentorship/${id}/status`, data: { status } }),
  },
  chat: {
    list: () => apiFetch<{ threads: any[] }>({ method: "GET", url: "/chat" }),
    getThread: (id: string) => apiFetch<{ messages: any[] }>({ method: "GET", url: `/chat/${id}` }),
    sendMessage: (id: string, text: string) => apiFetch<{ message: any }>({ method: "POST", url: `/chat/${id}`, data: { text } }),
    createThread: (targetUserId: string) => apiFetch<{ thread: any }>({ method: "POST", url: "/chat", data: { targetUserId } }),
  },
};