import { apiFetch } from "@/lib/api";
import {
  recommendedAlumni,
  getAlumniById,
  jobs as mockJobs,
  getJobById,
  events as mockEvents,
  getEventById,
  stories as mockStories,
  announcements as mockAnnouncements,
  chatThreads as mockChatThreads,
  mentorshipRequests as mockMentorshipRequests,
  adminMetrics as mockAdminMetrics,
  notifications as mockNotifications,
} from "@/lib/mock-data";
import type { Alumni, AuthSession, EventItem, Job, LoginInput, ReferralRequest, RegisterInput, User } from "./types";

let inMemoryReferrals: ReferralRequest[] = [
  {
    id: "ref_1",
    status: "pending",
    message: "Hi! I saw the Senior Frontend Engineer opening at Stripe and would love a referral.",
    createdAt: new Date().toISOString(),
    requester: {
      id: "u_demo",
      name: "Alex Kim",
      email: "alex.kim@alumni.edu",
      role: "student",
      batchYear: "2025",
      department: "Computer Science",
    },
    recipient: {
      id: "alumni_1",
      name: "Elena Rostova",
      email: "elena@stripe.com",
      role: "alumni",
      batchYear: "2019",
      department: "Computer Science",
    },
    job: mockJobs[0],
  },
];

let inMemoryMentorships = [...mockMentorshipRequests];
let inMemoryChatThreads = [...mockChatThreads];

export const apiClient = {
  auth: {
    login: async (input: LoginInput): Promise<AuthSession> => {
      try {
        return await apiFetch<AuthSession>({ method: "POST", url: "/auth/login", data: input });
      } catch {
        const role = input.email.includes("admin")
          ? "admin"
          : input.email.includes("faculty")
          ? "faculty"
          : input.email.includes("alumni")
          ? "alumni"
          : "student";
        const name = input.email.split("@")[0].replace(/[._]/g, " ") || "Alex Kim";
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
        return {
          token: `demo_token_${Date.now()}`,
          user: {
            id: `u_${Date.now()}`,
            name: formattedName,
            email: input.email,
            role,
            batchYear: "2025",
            department: "Computer Science",
          },
        };
      }
    },
    register: async (input: RegisterInput): Promise<AuthSession> => {
      try {
        return await apiFetch<AuthSession>({ method: "POST", url: "/auth/register", data: input });
      } catch {
        return {
          token: `demo_token_${Date.now()}`,
          user: {
            id: `u_${Date.now()}`,
            name: input.name,
            email: input.email,
            role: (input.role?.toLowerCase() as User["role"]) || "student",
            batchYear: "2025",
            department: "Computer Science",
          },
        };
      }
    },
    me: async (): Promise<User> => {
      try {
        return await apiFetch<User>({ method: "GET", url: "/users/me" });
      } catch {
        return {
          id: "u_demo",
          name: "Alex Kim",
          email: "alex.kim@alumni.edu",
          role: "student",
          batchYear: "2025",
          department: "Computer Science",
        };
      }
    },
  },
  users: {
    updateProfile: async (data: Partial<User>) => {
      try {
        return await apiFetch<{ user: User }>({ method: "PATCH", url: "/users/me", data }).then((res) => res.user);
      } catch {
        return {
          id: "u_demo",
          name: data.name || "Alex Kim",
          email: data.email || "alex.kim@alumni.edu",
          role: data.role || "student",
          batchYear: data.batchYear || "2025",
          department: data.department || "Computer Science",
        } as User;
      }
    },
  },
  uploads: {
    resume: async (file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      try {
        return await apiFetch<{ url: string }>({
          method: "POST",
          url: "/uploads/resume",
          data: fd,
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch {
        return { url: "https://example.com/mock-resume.pdf" };
      }
    },
  },
  alumni: {
    list: async (query?: string, options?: { filter?: string | null; value?: string | null }): Promise<Alumni[]> => {
      const params: Record<string, string> = {};
      if (query) params.q = query;
      if (options?.filter && options?.value) {
        params.filter = options.filter;
        params.filterValue = options.value;
      }
      try {
        const res = await apiFetch<{ alumni: Alumni[] }>({
          method: "GET",
          url: "/users/alumni",
          params: Object.keys(params).length > 0 ? params : undefined,
        });
        return res.alumni;
      } catch {
        let list = [...recommendedAlumni];
        if (query) {
          const q = query.toLowerCase();
          list = list.filter(
            (a) =>
              a.name.toLowerCase().includes(q) ||
              a.company.toLowerCase().includes(q) ||
              a.role.toLowerCase().includes(q) ||
              a.location.toLowerCase().includes(q)
          );
        }
        if (options?.filter === "batch" && options?.value) {
          list = list.filter((a) => a.batch === options.value);
        } else if (options?.filter === "department" && options?.value) {
          list = list.filter((a) => a.department === options.value);
        } else if (options?.filter === "location" && options?.value) {
          list = list.filter((a) => a.location === options.value);
        } else if (options?.filter === "mentors") {
          list = list.filter((a) => a.isMentor);
        }
        return list;
      }
    },
    get: async (id: string): Promise<Alumni> => {
      try {
        return await apiFetch<Alumni>({ method: "GET", url: `/users/${id}` });
      } catch {
        const found = getAlumniById(id);
        if (found) return found;
        return recommendedAlumni[0];
      }
    },
  },
  jobs: {
    list: async (): Promise<Job[]> => {
      try {
        return await apiFetch<{ jobs: Job[] }>({ method: "GET", url: "/jobs" }).then((res) => res.jobs);
      } catch {
        return mockJobs;
      }
    },
    get: async (id: string): Promise<Job> => {
      try {
        return await apiFetch<Job>({ method: "GET", url: `/jobs/${id}` });
      } catch {
        const found = getJobById(id);
        if (found) return found;
        return mockJobs[0];
      }
    },
  },
  events: {
    list: async (): Promise<EventItem[]> => {
      try {
        return await apiFetch<{ events: EventItem[] }>({ method: "GET", url: "/events" }).then((res) => res.events);
      } catch {
        return mockEvents;
      }
    },
    get: async (id: string): Promise<EventItem> => {
      try {
        return await apiFetch<EventItem>({ method: "GET", url: `/events/${id}` });
      } catch {
        const found = getEventById(id);
        if (found) return found;
        return mockEvents[0];
      }
    },
    rsvp: async (id: string): Promise<{ attending: boolean }> => {
      try {
        return await apiFetch<{ attending: boolean }>({ method: "POST", url: `/events/${id}/rsvp` });
      } catch {
        return { attending: true };
      }
    },
  },
  requests: {
    list: async (): Promise<ReferralRequest[]> => {
      try {
        return await apiFetch<{ referrals: ReferralRequest[] }>({
          method: "GET",
          url: "/referrals/me/received",
        }).then((res) => res.referrals);
      } catch {
        return inMemoryReferrals;
      }
    },
    create: async (jobId: string, message: string): Promise<ReferralRequest> => {
      try {
        return await apiFetch<ReferralRequest>({ method: "POST", url: "/referrals", data: { jobId, message } });
      } catch {
        const job = getJobById(jobId) || mockJobs[0];
        const newRef: ReferralRequest = {
          id: `ref_${Date.now()}`,
          status: "pending",
          message,
          createdAt: new Date().toISOString(),
          requester: {
            id: "u_demo",
            name: "Alex Kim",
            email: "alex.kim@alumni.edu",
            role: "student",
            batchYear: "2025",
            department: "Computer Science",
          },
          recipient: {
            id: "alumni_1",
            name: "Elena Rostova",
            email: "elena@stripe.com",
            role: "alumni",
            batchYear: "2019",
            department: "Computer Science",
          },
          job,
        };
        inMemoryReferrals = [newRef, ...inMemoryReferrals];
        return newRef;
      }
    },
    updateStatus: async (id: string, status: ReferralRequest["status"]): Promise<ReferralRequest> => {
      try {
        return await apiFetch<ReferralRequest>({ method: "PATCH", url: `/referrals/${id}/status`, data: { status } });
      } catch {
        inMemoryReferrals = inMemoryReferrals.map((r) => (r.id === id ? { ...r, status } : r));
        const found = inMemoryReferrals.find((r) => r.id === id);
        return found || inMemoryReferrals[0];
      }
    },
  },
  admin: {
    stats: async (): Promise<unknown> => {
      try {
        return await apiFetch<unknown>({ method: "GET", url: "/admin/stats" });
      } catch {
        return mockAdminMetrics;
      }
    },
  },
  stories: {
    list: async (): Promise<unknown[]> => {
      try {
        return await apiFetch<{ stories: unknown[] }>({ method: "GET", url: "/stories" }).then((res) => res.stories);
      } catch {
        return mockStories;
      }
    },
    create: async (data: unknown): Promise<unknown> => {
      try {
        return await apiFetch<unknown>({ method: "POST", url: "/stories", data });
      } catch {
        return { id: `story_${Date.now()}`, ...(data as object), createdAt: new Date().toISOString(), isApproved: true, votesCount: 1 };
      }
    },
    updateStatus: async (id: string, isApproved: boolean): Promise<unknown> => {
      try {
        return await apiFetch<unknown>({ method: "PATCH", url: `/stories/${id}/approve`, data: { isApproved } });
      } catch {
        return { id, isApproved };
      }
    },
    vote: async (id: string): Promise<{ hasVoted: boolean; message: string }> => {
      try {
        return await apiFetch<{ hasVoted: boolean; message: string }>({ method: "POST", url: `/stories/${id}/vote` });
      } catch {
        return { hasVoted: true, message: "Vote recorded" };
      }
    },
  },
  announcements: {
    list: async (): Promise<unknown[]> => {
      try {
        return await apiFetch<{ announcements: unknown[] }>({ method: "GET", url: "/announcements" }).then(
          (res) => res.announcements
        );
      } catch {
        return mockAnnouncements;
      }
    },
  },
  matching: {
    syncMe: () => apiFetch<{ message: string }>({ method: "POST", url: "/matching/sync-me" }),
    topAlumni: async (): Promise<{ student: unknown; alumni: unknown[] }> => {
      try {
        return await apiFetch<{ student: unknown; alumni: unknown[] }>({ method: "GET", url: "/matching/top-alumni" });
      } catch {
        return { student: {}, alumni: recommendedAlumni.slice(0, 6) };
      }
    },
  },
  mentorship: {
    list: async (): Promise<{ mentorships: unknown[] }> => {
      try {
        return await apiFetch<{ mentorships: unknown[] }>({ method: "GET", url: "/mentorship" });
      } catch {
        return { mentorships: inMemoryMentorships };
      }
    },
    create: async (data: { mentorId: string; area: string; message?: string }): Promise<{ mentorship: unknown }> => {
      try {
        return await apiFetch<{ mentorship: unknown }>({ method: "POST", url: "/mentorship", data });
      } catch {
        const newM = {
          id: `mentorship_${Date.now()}`,
          mentorId: data.mentorId,
          mentorName: getAlumniById(data.mentorId)?.name || "Elena Rostova",
          studentId: "u_demo",
          studentName: "Alex Kim",
          topic: data.area,
          status: "pending",
          note: data.message || "Mentorship inquiry",
          date: new Date().toISOString(),
        };
        inMemoryMentorships = [newM as unknown as typeof inMemoryMentorships[0], ...inMemoryMentorships];
        return { mentorship: newM };
      }
    },
    updateStatus: async (id: string, status: string): Promise<{ mentorship: unknown }> => {
      try {
        return await apiFetch<{ mentorship: unknown }>({ method: "PATCH", url: `/mentorship/${id}/status`, data: { status } });
      } catch {
        inMemoryMentorships = inMemoryMentorships.map((m) => (m.id === id ? { ...m, status: status as typeof m.status } : m));
        const found = inMemoryMentorships.find((m) => m.id === id);
        return { mentorship: found };
      }
    },
  },
  chat: {
    list: async (): Promise<{ threads: unknown[] }> => {
      try {
        return await apiFetch<{ threads: unknown[] }>({ method: "GET", url: "/chat" });
      } catch {
        return { threads: inMemoryChatThreads };
      }
    },
    getThread: async (id: string): Promise<{ messages: unknown[] }> => {
      try {
        return await apiFetch<{ messages: unknown[] }>({ method: "GET", url: `/chat/${id}` });
      } catch {
        return {
          messages: [
            { id: "m1", senderId: "alumni_1", senderName: "Elena Rostova", text: "Hi Alex! Happy to connect.", timestamp: "10:30 AM" },
            { id: "m2", senderId: "u_demo", senderName: "Alex Kim", text: "Thanks Elena! I'm interested in SWE roles at Stripe.", timestamp: "10:32 AM" },
          ],
        };
      }
    },
    sendMessage: async (id: string, text: string): Promise<{ message: unknown }> => {
      try {
        return await apiFetch<{ message: unknown }>({ method: "POST", url: `/chat/${id}`, data: { text } });
      } catch {
        const msg = {
          id: `m_${Date.now()}`,
          senderId: "u_demo",
          senderName: "Alex Kim",
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        return { message: msg };
      }
    },
    createThread: async (targetUserId: string): Promise<{ thread: unknown }> => {
      try {
        return await apiFetch<{ thread: unknown }>({ method: "POST", url: "/chat", data: { targetUserId } });
      } catch {
        const targetAlumni = getAlumniById(targetUserId) || recommendedAlumni[0];
        const newThread = {
          id: `thread_${Date.now()}`,
          participant: {
            id: targetAlumni.id,
            name: targetAlumni.name,
            role: targetAlumni.role,
            company: targetAlumni.company,
            avatarUrl: targetAlumni.avatarUrl,
          },
          lastMessage: {
            text: "Started conversation",
            timestamp: "Just now",
            unread: false,
          },
        };
        inMemoryChatThreads = [newThread as unknown as typeof inMemoryChatThreads[0], ...inMemoryChatThreads];
        return { thread: newThread };
      }
    },
  },
};
