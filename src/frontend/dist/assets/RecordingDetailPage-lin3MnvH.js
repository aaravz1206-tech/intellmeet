import { c as useParams, a as useNavigate, j as jsxRuntimeExports } from "./index-DuPiBNs4.js";
import { L as Layout, S as Skeleton, C as Clock } from "./skeleton-BC9doiGj.js";
import { C as ChevronRight, B as Badge } from "./badge-ClzJbiTe.js";
import { c as createLucideIcon, u as useAuthGuard, B as Button } from "./createLucideIcon-DskF2vxw.js";
import { u as useBackend, a as useQuery, U as Users } from "./useBackend-BtzrIPd3.js";
import { u as ue } from "./index-WVRWQld7.js";
import { H as History } from "./history-D5CPoepJ.js";
import { A as ArrowLeft } from "./arrow-left-GcjwSzvM.js";
import { F as Film } from "./film-Dfvs-EHm.js";
import "./terminal-DJyHpPFm.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["line", { x1: "22", x2: "2", y1: "12", y2: "12", key: "1y58io" }],
  [
    "path",
    {
      d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      key: "oot6mr"
    }
  ],
  ["line", { x1: "6", x2: "6.01", y1: "16", y2: "16", key: "sgf278" }],
  ["line", { x1: "10", x2: "10.01", y1: "16", y2: "16", key: "1l4acy" }]
];
const HardDrive = createLucideIcon("hard-drive", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }],
  ["circle", { cx: "6", cy: "12", r: "3", key: "w7nqdw" }],
  ["circle", { cx: "18", cy: "19", r: "3", key: "1xt0gg" }],
  ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49", key: "47mynk" }],
  ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49", key: "1n3mei" }]
];
const Share2 = createLucideIcon("share-2", __iconNode$1);
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
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode);
function formatDurationMMSS(secs) {
  const s = Number(secs);
  const h = Math.floor(s / 3600);
  const m = Math.floor(s % 3600 / 60);
  const sec = s % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function formatFileSize(bytes) {
  return "Unknown";
}
function MetaStat({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "code-label text-muted-foreground flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-3.5 h-3.5" }),
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-foreground", children: value })
  ] });
}
function RecordingDetailPage() {
  useAuthGuard({ requireAuth: true });
  const { id } = useParams({ from: "/recording/$id" });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { data: recording, isLoading } = useQuery({
    queryKey: ["recording", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getRecordingById(BigInt(id));
    },
    enabled: !!actor && !isFetching
  });
  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      ue.success("Link copied to clipboard!", {
        description: "Share this recording with your team."
      });
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-4 max-w-5xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "nav",
      {
        className: "flex items-center gap-1.5 text-sm",
        "aria-label": "Breadcrumb",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => navigate({ to: "/history" }),
              className: "code-label text-muted-foreground hover:text-primary transition-smooth flex items-center gap-1",
              "data-ocid": "recording.breadcrumb_history",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-3.5 h-3.5" }),
                "Meeting History"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5 text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "code-label",
              style: { color: "oklch(0.65 0.2 40)" },
              children: [
                "Recording #",
                id
              ]
            }
          )
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-8 max-w-5xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "ghost",
          className: "font-mono text-sm text-muted-foreground hover:text-primary -ml-2 mb-6",
          onClick: () => navigate({ to: "/history" }),
          "data-ocid": "recording.back_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }),
            " Back to History"
          ]
        }
      ),
      isLoading || isFetching ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "recording.loading_state", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full aspect-video rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-28" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-28" })
        ] }, i)) })
      ] }) : !recording ? (
        /* Not found */
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded-xl p-14 flex flex-col items-center gap-4",
            style: {
              borderColor: "oklch(0.65 0.2 40 / 0.4)",
              background: "oklch(0.65 0.2 40 / 0.06)"
            },
            "data-ocid": "recording.error_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TriangleAlert,
                {
                  className: "w-12 h-12",
                  style: { color: "oklch(0.65 0.2 40)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-semibold text-foreground text-lg", children: "Recording not available" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "code-label text-muted-foreground mt-1", children: "This recording may have been deleted or the link is invalid." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  className: "mt-1 font-mono gap-2",
                  style: {
                    borderColor: "oklch(0.65 0.2 40 / 0.5)",
                    color: "oklch(0.65 0.2 40)"
                  },
                  onClick: () => navigate({ to: "/history" }),
                  "data-ocid": "recording.go_history_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-4 h-4" }),
                    " Back to Meeting History"
                  ]
                }
              )
            ]
          }
        )
      ) : (
        /* Recording found */
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "rounded-xl overflow-hidden border",
              style: {
                borderColor: "oklch(0.55 0.15 142 / 0.5)",
                boxShadow: "0 0 24px 0 oklch(0.55 0.15 142 / 0.2)",
                background: "oklch(0.05 0 0)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "video",
                {
                  src: recording.fileUrl,
                  controls: true,
                  className: "w-full aspect-video",
                  style: { display: "block" },
                  "data-ocid": "recording.video_player",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "track",
                      {
                        kind: "captions",
                        src: "",
                        label: "English",
                        srcLang: "en",
                        default: true
                      }
                    ),
                    "Your browser does not support HTML5 video."
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-mono font-bold text-2xl text-foreground", children: [
                "Recording",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "oklch(0.55 0.15 142)" }, children: [
                  "#",
                  id
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "font-mono font-semibold text-lg tracking-widest mt-0.5",
                  style: { color: "oklch(0.55 0.15 142 / 0.8)" },
                  children: [
                    "#",
                    recording.roomCode
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                className: "code-label border-0 px-2.5 py-1 flex-shrink-0",
                style: {
                  background: "oklch(0.55 0.15 142 / 0.12)",
                  color: "oklch(0.55 0.15 142)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-3 h-3 mr-1" }),
                  " Video Recording"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "code-label text-muted-foreground mb-4 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-3.5 h-3.5" }),
              " Recording Details"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MetaStat,
                {
                  icon: Clock,
                  label: "Duration",
                  value: formatDurationMMSS(recording.durationSeconds)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MetaStat,
                {
                  icon: Users,
                  label: "Participants",
                  value: String(recording.participantsCount)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MetaStat,
                {
                  icon: Film,
                  label: "Recorded",
                  value: formatDate(recording.createdAt)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MetaStat,
                {
                  icon: HardDrive,
                  label: "File Size",
                  value: formatFileSize()
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: recording.fileUrl,
                download: `recording-${id}.webm`,
                className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm transition-smooth",
                style: {
                  background: "oklch(0.55 0.15 142 / 0.12)",
                  border: "1px solid oklch(0.55 0.15 142 / 0.4)",
                  color: "oklch(0.55 0.15 142)"
                },
                "data-ocid": "recording.download_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
                  " Download Recording"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: handleShare,
                className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm transition-smooth",
                style: {
                  background: "oklch(0.65 0.2 40 / 0.1)",
                  border: "1px solid oklch(0.65 0.2 40 / 0.4)",
                  color: "oklch(0.65 0.2 40)"
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.background = "oklch(0.65 0.2 40 / 0.2)";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.background = "oklch(0.65 0.2 40 / 0.1)";
                },
                "data-ocid": "recording.share_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-4 h-4" }),
                  " Share Link"
                ]
              }
            )
          ] })
        ] })
      )
    ] })
  ] }) });
}
export {
  RecordingDetailPage
};
