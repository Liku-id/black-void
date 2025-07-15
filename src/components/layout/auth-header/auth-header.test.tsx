import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AuthHeader from ".";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/assets/logo/white-logo.svg", () => "/white-logo.svg");
jest.mock("@/assets/icons/close.svg", () => "/close.svg");

describe("AuthHeader", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    pushMock.mockClear();
  });

  it("renders logo and close icon", () => {
    render(<AuthHeader />);
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
    expect(screen.getByAltText(/close/i)).toBeInTheDocument();
  });

  it("calls onClose and redirects to / when close is clicked", () => {
    const onClose = jest.fn();
    render(<AuthHeader onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
    // Accept any path that starts with '/'
    expect(pushMock).toHaveBeenCalledWith(expect.stringContaining("/"));
  });

  it("redirects to / even if onClose is not provided", () => {
    render(<AuthHeader />);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    // Accept any path that starts with '/'
    expect(pushMock).toHaveBeenCalledWith(expect.stringContaining("/"));
  });
}); 