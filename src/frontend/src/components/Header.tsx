import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import { LogOut, Terminal } from "lucide-react";

function shortenPrincipal(principal: string): string {
  if (principal.length <= 12) return principal;
  return `${principal.slice(0, 5)}...${principal.slice(-3)}`;
}

export function Header() {
  const { isAuthenticated, identity, clear } = useInternetIdentity();
  const principal = identity?.getPrincipal().toText() ?? "";

  return (
    <header
      className="sticky top-0 z-50 bg-card border-b border-primary/30"
      style={{ boxShadow: "0 0 12px 0 oklch(0.55 0.15 142 / 0.25)" }}
      data-ocid="app.header"
    >
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          data-ocid="app.logo_link"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded border border-primary/50 bg-primary/10 glow-emerald group-hover:glow-emerald-active transition-smooth">
            <Terminal className="w-4 h-4 text-primary" />
          </div>
          <span className="font-mono font-bold text-lg tracking-tight text-foreground">
            Intell<span className="text-primary">Meet</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated && principal && (
            <div className="flex items-center gap-2">
              <span className="code-label text-muted-foreground hidden sm:block">
                {shortenPrincipal(principal)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clear}
                aria-label="Logout"
                data-ocid="app.logout_button"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
