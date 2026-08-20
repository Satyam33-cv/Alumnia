import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JobListContent } from "@/components/JobListContent";

const mockJobs = [
  { id: "job-1", title: "Associate Product Manager", company: "Northstar Labs", type: "Full-time", location: "New York / Hybrid", posted: "2d ago", referralAvailable: true, description: "Test description", postedBy: "Priya Raman", postedByBatch: "2018", remote: false },
  { id: "job-2", title: "Research Analyst", company: "Morrow Health", type: "Full-time", location: "Remote", posted: "4d ago", referralAvailable: true, description: "Test description 2", postedBy: "Elena Torres", postedByBatch: "2020", remote: true },
];

describe("JobListContent", () => {
  beforeEach(() => {
    render(<JobListContent />);
  });

  it("renders the career board heading", () => {
    const heading = screen.getByText(/open doors/i);
    expect(heading).toBeInTheDocument();
  });

  it("renders job listings", () => {
    mockJobs.forEach((job) => {
      const jobCard = screen.getByText(job.title);
      expect(jobCard).toBeInTheDocument();
    });
  });

  it("renders referral available badge", () => {
    const referralBadge = screen.getByText(/referral available/i);
    expect(referralBadge).toBeInTheDocument();
  });

  it("renders apply button for students", () => {
    const applyButton = screen.getByRole("button", { name: /apply/i });
    expect(applyButton).toBeInTheDocument();
  });

  it("renders request referral button when available", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /request referral/i }));
    // Modal should open or button should be interactive
  });

  it("renders bookmark button", () => {
    const bookmarkButton = screen.getByRole("button", { name: /bookmark job/i });
    expect(bookmarkButton).toBeInTheDocument();
  });

  it("shows no roles match state when filtered out", async () => {
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/search job titles/);
    await user.type(input, "nonexistent");
    await waitFor(() => {
      const noRoles = screen.getByText(/no roles match/i);
      expect(noRoles).toBeInTheDocument();
    });
  });

  it("renders funnel/stats when jobs available", () => {
    const funnel = screen.getByText(/referral funnel/i);
    expect(funnel).toBeInTheDocument();
  });
});