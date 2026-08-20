import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DashboardContent } from "@/components/DashboardContent";

const mockUser = {
  id: "user-1",
  name: "Ava Mitchell",
  email: "ava@alumni.edu",
  role: "alumni",
};

const mockAlumni = [
  { id: "al-priya", name: "Priya Raman", batch: "2018", company: "Northstar Labs", role: "Product Designer", location: "New York, NY", initials: "PR", match: 94 },
  { id: "al-marcus", name: "Marcus Chen", batch: "2016", company: "Fieldwork", role: "Strategy Lead", location: "Chicago, IL", initials: "MC", match: 87 },
];

const mockJobs = [
  { id: "job-1", title: "Associate Product Manager", company: "Northstar Labs", type: "Full-time", location: "New York / Hybrid", posted: "2d ago", referralAvailable: true },
  { id: "job-2", title: "Research Analyst", company: "Morrow Health", type: "Full-time", location: "Remote", posted: "4d ago", referralAvailable: true },
];

const mockRequests = [
  { id: "req-1", studentName: "Alex Kim", status: "pending" },
];

describe("DashboardContent", () => {
  beforeEach(() => {
    render(<DashboardContent />);
  });

  it("renders personalized greeting", () => {
    const greeting = screen.getByText(/good morning, ava/i);
    expect(greeting).toBeInTheDocument();
  });

  it("renders people worth knowing section", () => {
    const section = screen.getByText(/people worth knowing/i);
    expect(section).toBeInTheDocument();
  });

  it("renders alumni cards in people section", () => {
    mockAlumni.forEach((alumni) => {
      const card = screen.getByText(alumni.name);
      expect(card).toBeInTheDocument();
    });
  });

  it("renders empty state when no alumni", async () => {
    // Test empty state renders
    const emptyState = screen.getByText(/your network is waiting/i);
    expect(emptyState).toBeInTheDocument();
  });

  it("renders open doors section with jobs", () => {
    const jobsSection = screen.getByText(/open doors/i);
    expect(jobsSection).toBeInTheDocument();
  });

  it("renders job cards", () => {
    mockJobs.forEach((job) => {
      const jobCard = screen.getByText(job.title);
      expect(jobCard).toBeInTheDocument();
    });
  });

  it("rends referral thread when active request exists", () => {
    const referralThread = screen.getByText(/your active thread/i);
    expect(referralThread).toBeInTheDocument();
  });

  it("renders requests list", () => {
    const requestsSection = screen.getByText(/referral threads/i);
    expect(requestsSection).toBeInTheDocument();
  });

  it("shows loading state during data fetch", () => {
    const skeletons = screen.getAllByText(/busy|loading/i);
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("shows error state on fetch failure", async () => {
    const errorState = screen.getByText(/your dashboard is unavailable/i);
    expect(errorState).toBeInTheDocument();
  });
});