import { render, screen } from "@testing-library/react";
import { AlumniCard } from "@/components/AlumniCard";

const mockAlumni = {
  id: "al-priya",
  name: "Priya Raman",
  batch: "2018",
  company: "Northstar Labs",
  role: "Product Designer",
  location: "New York, NY",
  initials: "PR",
  match: 94,
};

describe("AlumniCard", () => {
  beforeEach(() => {
    render(<AlumniCard alumni={mockAlumni} />);
  });

  it("renders alumni initials", () => {
    const initials = screen.getByText("PR");
    expect(initials).toBeInTheDocument();
  });

  it("renders alumni name", () => {
    const name = screen.getByText("Priya Raman");
    expect(name).toBeInTheDocument();
  });

  it("renders batch year", () => {
    const batch = screen.getByText("Class of 2018");
    expect(batch).toBeInTheDocument();
  });

  it("renders role and company", () => {
    const roleCompany = screen.getByText("Product Designer at Northstar Labs");
    expect(roleCompany).toBeInTheDocument();
  });

  it("renders location with map pin", () => {
    const location = screen.getByText("New York, NY");
    expect(location).toBeInTheDocument();
  });

  it("renders match ring when match prop is provided", () => {
    const matchRing = screen.getByTestId("match-ring");
    expect(matchRing).toBeInTheDocument();
  });

  it("does not render match ring when match is undefined", () => {
    const { unmount } = render(
      <AlumniCard alumni { ...mockAlumni } match={undefined} />
    );
    unmount();
    const container = screen.getByText("Class of 2018");
    expect(container).toBeInTheDocument();
  });

  it("links to profile page with alumni ID", () => {
    const link = screen.getByRole("link", { name: /view profile/i });
    expect(link).toHaveAttribute("href", "/directory/al-priya");
  });

  it("renders view profile link with arrow icon", () => {
    const link = screen.getByRole("link", { name: /view profile/i });
    expect(link).toBeInTheDocument();
  });
});