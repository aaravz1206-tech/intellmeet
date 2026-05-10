import { u as useInternetIdentity, j as jsxRuntimeExports, L as Link, r as reactExports } from "./index-DuPiBNs4.js";
import { c as createLucideIcon, u as useAuthGuard, B as Button } from "./createLucideIcon-DskF2vxw.js";
import { T as Terminal } from "./terminal-DJyHpPFm.js";
import { M as Monitor, P as PenTool } from "./pen-tool-CgAy0B4d.js";
import { H as History } from "./history-D5CPoepJ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4", key: "1nerag" }],
  ["path", { d: "M14 13.12c0 2.38 0 6.38-1 8.88", key: "o46ks0" }],
  ["path", { d: "M17.29 21.02c.12-.6.43-2.3.5-3.02", key: "ptglia" }],
  ["path", { d: "M2 12a10 10 0 0 1 18-6", key: "ydlgp0" }],
  ["path", { d: "M2 16h.01", key: "1gqxmh" }],
  ["path", { d: "M21.8 16c.2-2 .131-5.354 0-6", key: "drycrb" }],
  ["path", { d: "M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2", key: "1tidbn" }],
  ["path", { d: "M8.65 22c.21-.66.45-1.32.57-2", key: "13wd9y" }],
  ["path", { d: "M9 6.8a6 6 0 0 1 9 5.2v2", key: "1fr1j5" }]
];
const Fingerprint = createLucideIcon("fingerprint", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "16", r: "1", key: "1au0dj" }],
  ["rect", { x: "3", y: "10", width: "18", height: "12", rx: "2", key: "6s8ecr" }],
  ["path", { d: "M7 10V7a5 5 0 0 1 10 0v3", key: "1pqi11" }]
];
const LockKeyhole = createLucideIcon("lock-keyhole", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
const Shield = createLucideIcon("shield", __iconNode);
const CYCLING_WORDS = [
  "Encrypted.",
  "Collaborative.",
  "Enterprise.",
  "Decentralised."
];
const FEATURE_CARDS = [
  {
    icon: Monitor,
    label: "Video Conferencing",
    desc: "Peer-to-peer WebRTC with sub-200ms latency across any network"
  },
  {
    icon: PenTool,
    label: "Collaborative Whiteboard",
    desc: "Live canvas synchronised in real-time across all participants"
  },
  {
    icon: Shield,
    label: "Secure Recording",
    desc: "Encrypted session recording with automatic cloud upload"
  }
];
function TerminalTyper() {
  const [wordIdx, setWordIdx] = reactExports.useState(0);
  const [displayed, setDisplayed] = reactExports.useState("");
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const [blink, setBlink] = reactExports.useState(true);
  const timeoutRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const word = CYCLING_WORDS[wordIdx];
    if (!isDeleting && displayed.length < word.length) {
      timeoutRef.current = setTimeout(
        () => setDisplayed(word.slice(0, displayed.length + 1)),
        80
      );
    } else if (!isDeleting && displayed.length === word.length) {
      timeoutRef.current = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && displayed.length > 0) {
      timeoutRef.current = setTimeout(
        () => setDisplayed(displayed.slice(0, -1)),
        40
      );
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setWordIdx((prev) => (prev + 1) % CYCLING_WORDS.length);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayed, isDeleting, wordIdx]);
  reactExports.useEffect(() => {
    const id = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(id);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-primary text-lg md:text-xl font-semibold tracking-wider", children: [
    displayed,
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "inline-block w-[2px] h-[1.1em] ml-0.5 align-middle bg-primary",
        style: { opacity: blink ? 1 : 0 }
      }
    )
  ] });
}
function LoginPage() {
  useAuthGuard({ requireAuth: false });
  const { login, loginStatus } = useInternetIdentity();
  const isLoading = loginStatus === "logging-in";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background grid-pattern relative flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 pointer-events-none",
        "aria-hidden": "true",
        style: {
          background: "radial-gradient(ellipse 70% 60% at 50% 0%, oklch(0.55 0.15 142 / 0.07) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 80% 80%, oklch(0.65 0.2 40 / 0.05) 0%, transparent 60%)"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative z-20 flex items-center justify-between px-6 py-4 border-b border-border/50 bg-card/60 backdrop-blur-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center w-8 h-8 rounded-lg border border-primary/40 bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "w-4 h-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold text-lg tracking-tight", children: [
          "Intell",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Meet" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "code-label text-muted-foreground hidden sm:block", children: "v2.0 — ENTERPRISE" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16 gap-14", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "flex flex-col items-center gap-6 text-center max-w-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 rounded-full",
              style: {
                filter: "blur(32px)",
                background: "oklch(0.55 0.15 142 / 0.25)"
              },
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex items-center justify-center w-24 h-24 rounded-full border border-primary/50 bg-primary/10 glow-emerald", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "w-12 h-12 text-primary" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-mono font-bold text-5xl md:text-6xl tracking-tight", children: [
            "Intell",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Meet" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-muted-foreground text-base uppercase tracking-[0.25em]", children: "Enterprise Video Conferencing" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-muted-foreground text-base", children: "// " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TerminalTyper, {})
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "section",
        {
          className: "w-full max-w-sm bg-card rounded-2xl p-8 flex flex-col gap-6 border-emerald-glow",
          "data-ocid": "login.card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-mono font-semibold text-xl text-foreground", children: "Secure Access" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Authenticate with Internet Identity — cryptographic, passwordless, unstoppable." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "lg",
                className: "w-full font-mono text-base gap-3 glow-emerald hover:glow-emerald-active transition-smooth",
                onClick: () => login(),
                disabled: isLoading,
                "data-ocid": "login.submit_button",
                children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin",
                      "aria-hidden": "true"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Authenticating..." })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Fingerprint, { className: "w-5 h-5", "aria-hidden": "true" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Connect with Internet Identity" })
                ] })
              }
            ),
            isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-center gap-2 py-2",
                "data-ocid": "login.loading_state",
                "aria-live": "polite",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "w-1.5 h-1.5 rounded-full bg-primary animate-pulse",
                      "aria-hidden": "true"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-primary", children: "ESTABLISHING SECURE TUNNEL..." })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center", children: [
              "No account needed — your ICP principal ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-mono", children: "IS" }),
              " your identity."
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "w-full max-w-3xl", "aria-label": "Platform features", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: FEATURE_CARDS.map(({ icon: Icon, label, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "group relative bg-card rounded-xl p-5 flex flex-col gap-3 border border-primary/20 hover:border-primary/60 transition-smooth overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none",
                style: {
                  background: "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.55 0.15 142 / 0.08) 0%, transparent 80%)"
                },
                "aria-hidden": "true"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex items-center justify-center w-10 h-10 rounded-lg bg-accent/15 border border-accent/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5 text-accent", "aria-hidden": "true" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm font-semibold text-foreground", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: desc })
            ] })
          ]
        },
        label
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-6 flex-wrap justify-center", children: [
        { dot: "bg-primary", label: "WebRTC Engine" },
        { dot: "bg-primary", label: "AI Services" },
        { dot: "bg-accent", label: "Recording API" }
      ].map(({ dot, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `w-2 h-2 rounded-full ${dot} animate-pulse`,
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: label })
      ] }, label)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "relative z-20 border-t border-border/40 bg-card/40 backdrop-blur-sm px-6 py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "w-3.5 h-3.5 text-primary", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: "IntellMeet — Enterprise Grade" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "nav",
        {
          className: "flex items-center gap-5",
          "aria-label": "Footer navigation",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/",
                className: "flex items-center gap-1.5 font-mono text-xs text-primary hover:text-primary/80 transition-smooth",
                "data-ocid": "footer.home_link",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "w-3 h-3", "aria-hidden": "true" }),
                  "Home"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "flex items-center gap-1.5 font-mono text-xs text-muted-foreground/50 cursor-not-allowed select-none",
                title: "Sign in to access Dashboard",
                "data-ocid": "footer.dashboard_link",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LockKeyhole, { className: "w-3 h-3", "aria-hidden": "true" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "w-3 h-3", "aria-hidden": "true" }),
                  "Dashboard"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "flex items-center gap-1.5 font-mono text-xs text-muted-foreground/50 cursor-not-allowed select-none",
                title: "Sign in to access Meeting History",
                "data-ocid": "footer.history_link",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LockKeyhole, { className: "w-3 h-3", "aria-hidden": "true" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-3 h-3", "aria-hidden": "true" }),
                  "Meeting History"
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground/50", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "hover:text-muted-foreground transition-smooth",
            children: "caffeine.ai"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  LoginPage
};
