export type { Alumni, AlumniId, EventItem, Job, Announcement, Story, Notification, ChatThread, MentorshipRequest } from "@/lib/mock-data";

export type User = {
  id: string;
  name: string;
  email: string;
  role?: "student" | "alumni" | "admin" | "faculty";
  alumni?: {
    graduationYear?: number;
    department?: string;
    [key: string]: unknown;
  };
};

export type AuthSession = {
  token: string;
  user: User;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = LoginInput & {
  name: string;
};

export type ReferralStatus = "pending" | "accepted" | "rejected" | "referred" | "hired";

export type ReferralRequest = {
  id: string;
  status: ReferralStatus;
  message: string;
  createdAt: string;
  requester: User;
  recipient: User;
  job?: import("@/lib/mock-data").Job;
};

export type AdminMetrics = {
  members: number;
  activeMembers: number;
  openJobs: number;
  pendingRequests: number;
  upcomingEvents: number;
  verifiedAlumni?: number;
  totalReferrals?: number;
  hiredThroughReferrals?: number;
};
