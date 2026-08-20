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
    list: () => apiFetch<ReferralRequest[]>({ method: "GET", url: "/requests" }),
    create: (jobId: string, message: string) => apiFetch<ReferralRequest>({ method: "POST", url: "/requests", data: { jobId, message } }),
    updateStatus: (id: string, status: ReferralRequest["status"]) => apiFetch<ReferralRequest>({ method: "PATCH", url: `/requests/${id}`, data: { status } }),
  },
  admin: {
    metrics: () => apiFetch<AdminMetrics>({ method: "GET", url: "/admin/metrics" }),
  },
};