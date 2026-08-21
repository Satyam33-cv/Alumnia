import { apiFetch } from "@/lib/api";
import type { Alumni, AuthSession, EventItem, Job, LoginInput, ReferralRequest, RegisterInput, User } from "./types";

export const apiClient = {
  auth: {
    login: (input: LoginInput) => apiFetch<AuthSession>({ method: "POST", url: "/auth/login", data: input }),
    register: (input: RegisterInput) => apiFetch<AuthSession>({ method: "POST", url: "/auth/register", data: input }),
    me: () => apiFetch<User>({ method: "GET", url: "/users/me" }),
  },
  users: {
    updateProfile: (data: Partial<User>) => apiFetch<{ user: User }>({ method: "PATCH", url: "/users/me", data }).then(res => res.user),
  },
  uploads: {
    resume: (file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      return apiFetch<{ url: string }>({ method: "POST", url: "/uploads/resume", data: fd, headers: { "Content-Type": "multipart/form-data" } });
    },
  },
  alumni: {
    list: (query?: string, options?: { filter?: string | null; value?: string | null }) => {
      const params: Record<string, string> = {};
      if (query) params.q = query;
      if (options?.filter && options?.value) {
        params.filter = options.filter;
        params.filterValue = options.value;
      }
      return apiFetch<{ alumni: Alumni[] }>({ method: "GET", url: "/users/alumni", params: Object.keys(params).length > 0 ? params : undefined })
        .then(res => res.alumni);
    },
    get: (id: string) => apiFetch<Alumni>({ method: "GET", url: `/users/${id}` }),
  },
  jobs: {
    list: () => apiFetch<{ jobs: Job[] }>({ method: "GET", url: "/jobs" }).then(res => res.jobs),
    get: (id: string) => apiFetch<Job>({ method: "GET", url: `/jobs/${id}` }),
  },
  events: {
    list: () => apiFetch<{ events: EventItem[] }>({ method: "GET", url: "/events" }).then(res => res.events),
    get: (id: string) => apiFetch<EventItem>({ method: "GET", url: `/events/${id}` }),
    rsvp: (id: string) => apiFetch<{ attending: boolean }>({ method: "POST", url: `/events/${id}/rsvp` }),
  },
  requests: {
    list: () => apiFetch<{ referrals: ReferralRequest[] }>({ method: "GET", url: "/referrals/me/received" }).then(res => res.referrals).catch(() => []),
    create: (jobId: string, message: string) => apiFetch<ReferralRequest>({ method: "POST", url: "/referrals", data: { jobId, message } }),
    updateStatus: (id: string, status: ReferralRequest["status"]) => apiFetch<ReferralRequest>({ method: "PATCH", url: `/referrals/${id}/status`, data: { status } }),
  },
  admin: {
    stats: () => apiFetch<unknown>({ method: "GET", url: "/admin/stats" }),
  },
  stories: {
    list: () => apiFetch<{ stories: unknown[] }>({ method: "GET", url: "/stories" }).then(res => res.stories).catch(() => []),
    create: (data: unknown) => apiFetch<unknown>({ method: "POST", url: "/stories", data }),
    updateStatus: (id: string, isApproved: boolean) => apiFetch<unknown>({ method: "PATCH", url: `/stories/${id}/approve`, data: { isApproved } }),
    vote: (id: string) => apiFetch<{ hasVoted: boolean; message: string }>({ method: "POST", url: `/stories/${id}/vote` }),
  },
  announcements: {
    list: () => apiFetch<{ announcements: unknown[] }>({ method: "GET", url: "/announcements" }).then(res => res.announcements).catch(() => []),
  },
  matching: {
    topAlumni: () => apiFetch<{ student: unknown; alumni: unknown[] }>({ method: "GET", url: "/matching/top-alumni" }),
  },
  mentorship: {
    list: () => apiFetch<{ mentorships: unknown[] }>({ method: "GET", url: "/mentorship" }),
    create: (data: { mentorId: string; area: string; message?: string }) => apiFetch<{ mentorship: unknown }>({ method: "POST", url: "/mentorship", data }),
    updateStatus: (id: string, status: string) => apiFetch<{ mentorship: unknown }>({ method: "PATCH", url: `/mentorship/${id}/status`, data: { status } }),
  },
  chat: {
    list: () => apiFetch<{ threads: unknown[] }>({ method: "GET", url: "/chat" }),
    getThread: (id: string) => apiFetch<{ messages: unknown[] }>({ method: "GET", url: `/chat/${id}` }),
    sendMessage: (id: string, text: string) => apiFetch<{ message: unknown }>({ method: "POST", url: `/chat/${id}`, data: { text } }),
    createThread: (targetUserId: string) => apiFetch<{ thread: unknown }>({ method: "POST", url: "/chat", data: { targetUserId } }),
  },
};