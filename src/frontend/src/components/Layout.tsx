import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
  /** Hide header/footer for full-screen pages like MeetingRoom */
  naked?: boolean;
}

/**
 * Main layout shell used by all authenticated pages.
 * Renders sticky header, scrollable content area, and footer.
 */
export function Layout({ children, naked = false }: LayoutProps) {
  if (naked) {
    return (
      <div className="min-h-screen bg-background flex flex-col">{children}</div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col grid-pattern">
      <Header />
      <main className="flex-1 flex flex-col" data-ocid="app.main_content">
        {children}
      </main>
      <Footer />
    </div>
  );
}
