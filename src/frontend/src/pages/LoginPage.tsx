import { Button } from "@/components/ui/button";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import {
  Fingerprint,
  History,
  LayoutDashboard,
  LockKeyhole,
  Monitor,
  PenTool,
  Shield,
  Terminal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CYCLING_WORDS = [
  "Encrypted.",
  "Collaborative.",
  "Enterprise.",
  "Decentralised.",
];

const FEATURE_CARDS = [
  {
    icon: Monitor,
    label: "Video Conferencing",
    desc: "Peer-to-peer WebRTC with sub-200ms latency across any network",
  },
  {
    icon: PenTool,
    label: "Collaborative Whiteboard",
    desc: "Live canvas synchronised in real-time across all participants",
  },
  {
    icon: Shield,
    label: "Secure Recording",
    desc: "Encrypted session recording with automatic cloud upload",
  },
] as const;

function TerminalTyper() {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [blink, setBlink] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const word = CYCLING_WORDS[wordIdx];
    if (!isDeleting && displayed.length < word.length) {
      timeoutRef.current = setTimeout(
        () => setDisplayed(word.slice(0, displayed.length + 1)),
        80,
      );
    } else if (!isDeleting && displayed.length === word.length) {
      timeoutRef.current = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && displayed.length > 0) {
      timeoutRef.current = setTimeout(
        () => setDisplayed(displayed.slice(0, -1)),
        40,
      );
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setWordIdx((prev) => (prev + 1) % CYCLING_WORDS.length);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayed, isDeleting, wordIdx]);

  useEffect(() => {
    const id = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-primary text-lg md:text-xl font-semibold tracking-wider">
      {displayed}
      <span
        className="inline-block w-[2px] h-[1.1em] ml-0.5 align-middle bg-primary"
        style={{ opacity: blink ? 1 : 0 }}
      />
    </span>
  );
}

export function LoginPage() {
  useAuthGuard({ requireAuth: false });
  const { login, loginStatus } = useInternetIdentity();
  const isLoading = loginStatus === "logging-in";

  return (
    <div className="min-h-screen bg-background grid-pattern relative flex flex-col">
      {/* Ambient glow backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, oklch(0.55 0.15 142 / 0.07) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 80% 80%, oklch(0.65 0.2 40 / 0.05) 0%, transparent 60%)",
        }}
      />

      {/* ── Header bar ──────────────────────────────────────────── */}
      <header className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-border/50 bg-card/60 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-primary/40 bg-primary/10">
            <Terminal className="w-4 h-4 text-primary" />
          </div>
          <span className="font-mono font-bold text-lg tracking-tight">
            Intell<span className="text-primary">Meet</span>
          </span>
        </div>
        <span className="code-label text-muted-foreground hidden sm:block">
          v2.0 — ENTERPRISE
        </span>
      </header>

      {/* ── Main content ────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16 gap-14">
        {/* Hero section */}
        <section className="flex flex-col items-center gap-6 text-center max-w-2xl">
          {/* Glow icon */}
          <div className="relative flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                filter: "blur(32px)",
                background: "oklch(0.55 0.15 142 / 0.25)",
              }}
              aria-hidden="true"
            />
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full border border-primary/50 bg-primary/10 glow-emerald">
              <Terminal className="w-12 h-12 text-primary" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="font-mono font-bold text-5xl md:text-6xl tracking-tight">
              Intell<span className="text-primary">Meet</span>
            </h1>
            <p className="font-mono text-muted-foreground text-base uppercase tracking-[0.25em]">
              Enterprise Video Conferencing
            </p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="font-mono text-muted-foreground text-base">
                &#47;&#47;&nbsp;
              </span>
              <TerminalTyper />
            </div>
          </div>
        </section>

        {/* Auth card */}
        <section
          className="w-full max-w-sm bg-card rounded-2xl p-8 flex flex-col gap-6 border-emerald-glow"
          data-ocid="login.card"
        >
          <div className="flex flex-col gap-1.5">
            <h2 className="font-mono font-semibold text-xl text-foreground">
              Secure Access
            </h2>
            <p className="text-sm text-muted-foreground">
              Authenticate with Internet Identity — cryptographic, passwordless,
              unstoppable.
            </p>
          </div>

          <Button
            type="button"
            size="lg"
            className="w-full font-mono text-base gap-3 glow-emerald hover:glow-emerald-active transition-smooth"
            onClick={() => login()}
            disabled={isLoading}
            data-ocid="login.submit_button"
          >
            {isLoading ? (
              <>
                <span
                  className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <Fingerprint className="w-5 h-5" aria-hidden="true" />
                <span>Connect with Internet Identity</span>
              </>
            )}
          </Button>

          {isLoading && (
            <div
              className="flex items-center justify-center gap-2 py-2"
              data-ocid="login.loading_state"
              aria-live="polite"
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
                aria-hidden="true"
              />
              <span className="font-mono text-xs text-primary">
                ESTABLISHING SECURE TUNNEL...
              </span>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            No account needed &mdash; your ICP principal&nbsp;
            <span className="text-primary font-mono">IS</span>&nbsp;your
            identity.
          </p>
        </section>

        {/* Feature cards */}
        <section className="w-full max-w-3xl" aria-label="Platform features">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FEATURE_CARDS.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="group relative bg-card rounded-xl p-5 flex flex-col gap-3 border border-primary/20 hover:border-primary/60 transition-smooth overflow-hidden"
              >
                {/* Hover glow bg */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.55 0.15 142 / 0.08) 0%, transparent 80%)",
                  }}
                  aria-hidden="true"
                />
                <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-accent/15 border border-accent/30">
                  <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
                </div>
                <div className="relative flex flex-col gap-1">
                  <p className="font-mono text-sm font-semibold text-foreground">
                    {label}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* System status strip */}
        <div className="flex items-center gap-6 flex-wrap justify-center">
          {[
            { dot: "bg-primary", label: "WebRTC Engine" },
            { dot: "bg-primary", label: "AI Services" },
            { dot: "bg-accent", label: "Recording API" },
          ].map(({ dot, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${dot} animate-pulse`}
                aria-hidden="true"
              />
              <span className="font-mono text-xs text-muted-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="relative z-20 border-t border-border/40 bg-card/40 backdrop-blur-sm px-6 py-5">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            <span className="font-mono text-xs text-muted-foreground">
              IntellMeet — Enterprise Grade
            </span>
          </div>

          <nav
            className="flex items-center gap-5"
            aria-label="Footer navigation"
          >
            <Link
              to="/"
              className="flex items-center gap-1.5 font-mono text-xs text-primary hover:text-primary/80 transition-smooth"
              data-ocid="footer.home_link"
            >
              <Terminal className="w-3 h-3" aria-hidden="true" />
              Home
            </Link>
            <span
              className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground/50 cursor-not-allowed select-none"
              title="Sign in to access Dashboard"
              data-ocid="footer.dashboard_link"
            >
              <LockKeyhole className="w-3 h-3" aria-hidden="true" />
              <LayoutDashboard className="w-3 h-3" aria-hidden="true" />
              Dashboard
            </span>
            <span
              className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground/50 cursor-not-allowed select-none"
              title="Sign in to access Meeting History"
              data-ocid="footer.history_link"
            >
              <LockKeyhole className="w-3 h-3" aria-hidden="true" />
              <History className="w-3 h-3" aria-hidden="true" />
              Meeting History
            </span>
          </nav>

          <p className="font-mono text-xs text-muted-foreground/50">
            &copy; {new Date().getFullYear()}{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-muted-foreground transition-smooth"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
