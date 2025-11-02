import type { ReactNode } from "react";

interface MainLayoutProps {
  rightPanel: ReactNode;
  leftPanel: ReactNode;
}

export const MainLayout = ({ leftPanel, rightPanel }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="hidden h-screen md:grid md:grid-cols-[1fr_1fr] lg:grid-cols-[40%_60%]">
        <section
          data-testid="transcript-panel-container"
          className="h-full overflow-hidden border-r border-border"
        >
          {leftPanel}
        </section>
        <section
          data-testid="video-panel-container"
          className="h-full overflow-hidden"
        >
          {rightPanel}
        </section>
      </div>

      <div className="flex h-screen flex-col md:hidden">
        <header data-testid="video-panel-container" className="shrink-0">
          {rightPanel}
        </header>
        <main
          data-testid="transcript-panel-container"
          className="flex-1 overflow-auto"
        >
          {leftPanel}
        </main>
      </div>
    </div>
  );
};
