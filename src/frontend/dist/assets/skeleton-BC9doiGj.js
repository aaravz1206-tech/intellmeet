import { c as createLucideIcon, B as Button, a as cn } from "./createLucideIcon-DskF2vxw.js";
import { j as jsxRuntimeExports, L as Link, u as useInternetIdentity } from "./index-DuPiBNs4.js";
import { T as Terminal } from "./terminal-DJyHpPFm.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode);
const year = (/* @__PURE__ */ new Date()).getFullYear();
const NAV_LINKS = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Meeting History", to: "/history" }
];
function Footer() {
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "footer",
    {
      className: "bg-card border-t border-border mt-auto",
      style: { borderTopColor: "oklch(0.18 0 0)" },
      "data-ocid": "app.footer",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/",
              className: "flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-smooth",
              "data-ocid": "app.footer_logo_link",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm font-semibold", children: [
                  "Intell",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Meet" })
                ] })
              ]
            }
          ),
          NAV_LINKS.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: link.to,
              className: "text-sm text-muted-foreground hover:text-primary transition-smooth",
              "data-ocid": `app.footer_${link.label.toLowerCase().replace(/ /g, "_")}_link`,
              children: link.label
            },
            link.to
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "© ",
          year,
          ". Built with love using",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: caffeineUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "hover:text-primary transition-smooth",
              children: "caffeine.ai"
            }
          )
        ] })
      ] }) })
    }
  );
}
function shortenPrincipal(principal) {
  if (principal.length <= 12) return principal;
  return `${principal.slice(0, 5)}...${principal.slice(-3)}`;
}
function Header() {
  const { isAuthenticated, identity, clear } = useInternetIdentity();
  const principal = (identity == null ? void 0 : identity.getPrincipal().toText()) ?? "";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "header",
    {
      className: "sticky top-0 z-50 bg-card border-b border-primary/30",
      style: { boxShadow: "0 0 12px 0 oklch(0.55 0.15 142 / 0.25)" },
      "data-ocid": "app.header",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto flex items-center justify-between h-14 px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/",
            className: "flex items-center gap-2 group",
            "data-ocid": "app.logo_link",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center w-8 h-8 rounded border border-primary/50 bg-primary/10 glow-emerald group-hover:glow-emerald-active transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "w-4 h-4 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold text-lg tracking-tight text-foreground", children: [
                "Intell",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Meet" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: isAuthenticated && principal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "code-label text-muted-foreground hidden sm:block", children: shortenPrincipal(principal) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "icon",
              onClick: clear,
              "aria-label": "Logout",
              "data-ocid": "app.logout_button",
              className: "text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4" })
            }
          )
        ] }) })
      ] })
    }
  );
}
function Layout({ children, naked = false }) {
  if (naked) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background flex flex-col", children });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col grid-pattern", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 flex flex-col", "data-ocid": "app.main_content", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
export {
  Clock as C,
  Layout as L,
  Skeleton as S
};
