import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MainLayout } from "@/components/layout/main-layout";

describe("MainLayout", () => {
  const renderLayout = () =>
    render(
      <MainLayout
        leftPanel={<div data-testid="transcript-panel">Transcript Panel</div>}
        rightPanel={<div data-testid="video-player">Video Player</div>}
      />
    );

  it("renders the transcript panel on the left side", () => {
    renderLayout();

    const transcriptContainer =
      screen.getAllByTestId("transcript-panel-container")[0];
    expect(
      transcriptContainer.querySelector('[data-testid="transcript-panel"]')
    ).toBeTruthy();
  });

  it("renders the video player on the right side", () => {
    renderLayout();

    const videoContainer = screen.getAllByTestId("video-panel-container")[0];
    expect(
      videoContainer.querySelector('[data-testid="video-player"]')
    ).toBeTruthy();
  });

  it("applies the responsive grid proportions on desktop", () => {
    const { container } = renderLayout();
    const gridContainer = container.querySelector(".md\\:grid");
    expect(gridContainer?.className).toContain("md:grid-cols-[1fr_1fr]");
  });
});
