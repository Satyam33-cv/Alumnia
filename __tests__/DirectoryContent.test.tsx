import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DirectoryContent } from "@/components/DirectoryContent";

const mockAlumni = [
  { id: "al-priya", name: "Priya Raman", batch: "2018", company: "Northstar Labs", role: "Product Designer", location: "New York, NY", initials: "PR", match: 94 },
  { id: "al-marcus", name: "Marcus Chen", batch: "2016", company: "Fieldwork", role: "Strategy Lead", location: "Chicago, IL", initials: "MC", match: 87 },
  { id: "al-elena", name: "Elena Torres", batch: "2020", company: "Morrow Health", role: "Data Scientist", location: "Austin, TX", initials: "ET", match: 81 },
];

describe("DirectoryContent", () => {
  beforeEach(() => {
    render(<DirectoryContent />);
  });

  it("renders the directory heading", () => {
    const heading = screen.getByText(/find your people/i);
    expect(heading).toBeInTheDocument();
  });

  it("renders search input", () => {
    const input = screen.getByRole("searchbox", { name: /search alumni/i });
    expect(input).toBeInTheDocument();
  });

  it("filters alumni by search query", async () => {
    const user = userEvent.setup();
    const input = screen.getByRole("searchbox", { name: /search alumni/i });
    await user.type(input, "priya");
    await waitFor(() => {
      const row = screen.getByText("Priya Raman");
      expect(row).toBeInTheDocument();
    });
  });

  it("renders alumni cards", () => {
    mockAlumni.forEach((alumni) => {
      const card = screen.getByText(alumni.name);
      expect(card).toBeInTheDocument();
    });
  });

  it("renders filter buttons", () => {
    const filterButtons = screen.getByText(/batch/i);
    expect(filterButtons).toBeInTheDocument();
  });

  it("shows empty state when no results match", async () => {
    const user = userEvent.setup();
    const input = screen.getByRole("searchbox", { name: /search alumni/i });
    await user.type(input, "nonexistent person");
    await waitFor(() => {
      const emptyState = screen.getByText(/no alumni match that search/i);
      expect(emptyState).toBeInTheDocument();
    });
  });

  it("renders loading skeleton during data fetch", () => {
    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders error state on fetch failure", async () => {
    const user = userEvent.setup();
    const input = screen.getByRole("searchbox", { name: /search alumni/i });
    await user.type(input, "test");
    // Error state should be available
    const errorMessage = screen.getByText(/the directory is unavailable/i);
    expect(errorMessage).toBeInTheDocument();
  });
});