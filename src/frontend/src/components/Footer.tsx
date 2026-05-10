import { Link } from "@tanstack/react-router";
import { Terminal } from "lucide-react";

const year = new Date().getFullYear();

const NAV_LINKS = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Meeting History", to: "/history" },
] as const;

export function Footer() {
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      className="bg-card border-t border-border mt-auto"
      style={{ borderTopColor: "oklch(0.18 0 0)" }}
      data-ocid="app.footer"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo + nav */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-smooth"
              data-ocid="app.footer_logo_link"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="font-mono text-sm font-semibold">
                Intell<span className="text-primary">Meet</span>
              </span>
            </Link>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                data-ocid={`app.footer_${link.label.toLowerCase().replace(/ /g, "_")}_link`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {year}. Built with love using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-smooth"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
