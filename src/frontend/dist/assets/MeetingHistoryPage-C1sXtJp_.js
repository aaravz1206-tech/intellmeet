import { a as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-DuPiBNs4.js";
import { L as Layout, S as Skeleton, C as Clock } from "./skeleton-BC9doiGj.js";
import { B as Badge, C as ChevronRight } from "./badge-ClzJbiTe.js";
import { u as useAuthGuard, B as Button } from "./createLucideIcon-DskF2vxw.js";
import { u as useBackend, a as useQuery, V as Variant_host_participant, U as Users } from "./useBackend-BtzrIPd3.js";
import { H as History } from "./history-D5CPoepJ.js";
import { P as Plus } from "./plus-BzWHcIIW.js";
import { C as Camera } from "./camera-DQro_1BT.js";
import "./terminal-DJyHpPFm.js";
function formatDurationMMSS(secs) {
  if (!secs) return "00:00";
  const s = Number(secs);
  const h = Math.floor(s / 3600);
  const m = Math.floor(s % 3600 / 60);
  const sec = s % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function SkeletonCard() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 flex flex-col gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-32" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20 rounded-full" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-48" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20" })
    ] })
  ] });
}
function MeetingHistoryPage() {
  useAuthGuard({ requireAuth: true });
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const [filter, setFilter] = reactExports.useState("all");
  const { data: history = [], isLoading: historyLoading } = useQuery({
    queryKey: ["meetingHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMeetingHistory();
    },
    enabled: !!actor && !isFetching
  });
  const { data: recordings = [], isLoading: recordingsLoading } = useQuery({
    queryKey: ["myRecordings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMyRecordings();
    },
    enabled: !!actor && !isFetching
  });
  const isLoading = historyLoading || recordingsLoading || isFetching;
  const recordingByRoom = /* @__PURE__ */ new Map();
  for (const rec of recordings) {
    recordingByRoom.set(rec.roomCode, rec);
  }
  const filtered = history.filter((e) => {
    if (filter === "host") return e.role === Variant_host_participant.host;
    if (filter === "participant")
      return e.role === Variant_host_participant.participant;
    return true;
  });
  const hostedCount = history.filter(
    (e) => e.role === Variant_host_participant.host
  ).length;
  const joinedCount = history.filter(
    (e) => e.role === Variant_host_participant.participant
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-6 max-w-5xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-mono font-bold text-2xl text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              History,
              {
                className: "w-6 h-6",
                style: { color: "oklch(0.65 0.2 40)" }
              }
            ),
            "Meeting History"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 font-mono", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40 inline-block" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: history.length }),
            " ",
            "session",
            history.length !== 1 ? "s" : "",
            " found"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => navigate({ to: "/dashboard" }),
            className: "font-mono text-sm border-border hover:border-primary/50 transition-smooth flex-shrink-0",
            "data-ocid": "history.back_button",
            children: "← Dashboard"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3 mt-5", children: [
        {
          label: "Total",
          value: history.length,
          color: "text-foreground"
        },
        { label: "As Host", value: hostedCount, color: "text-primary" },
        { label: "As Participant", value: joinedCount, color: "" }
      ].map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-lg bg-background border border-border px-4 py-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "code-label text-muted-foreground", children: label }),
            isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-10 mt-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `font-mono font-bold text-xl mt-0.5 ${color || "[color:oklch(0.65_0.2_40)]"}`,
                style: !color ? { color: "oklch(0.65 0.2 40)" } : void 0,
                children: value
              }
            )
          ]
        },
        label
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-6 max-w-5xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mb-6", "data-ocid": "history.filter.tab", children: [
        { key: "all", label: "All Sessions" },
        { key: "host", label: "Hosted by me" },
        { key: "participant", label: "Joined" }
      ].map(({ key, label }) => {
        const isActive = filter === key;
        const isHost = key === "host";
        const isParticipant = key === "participant";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setFilter(key),
            "data-ocid": `history.filter_${key}`,
            className: "relative px-4 py-1.5 rounded-lg code-label font-semibold transition-smooth border",
            style: {
              background: isActive ? isHost ? "oklch(0.55 0.15 142 / 0.15)" : isParticipant ? "oklch(0.65 0.2 40 / 0.15)" : "oklch(0.55 0.15 142 / 0.1)" : "transparent",
              borderColor: isActive ? isHost ? "oklch(0.55 0.15 142 / 0.8)" : isParticipant ? "oklch(0.65 0.2 40 / 0.8)" : "oklch(0.55 0.15 142 / 0.5)" : "oklch(0.18 0 0)",
              color: isActive ? isHost ? "oklch(0.55 0.15 142)" : isParticipant ? "oklch(0.65 0.2 40)" : "oklch(0.55 0.15 142)" : "oklch(0.58 0 0)"
            },
            children: [
              label,
              isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "ml-2 rounded px-1.5 py-0.5 text-[10px]",
                  style: {
                    background: isParticipant ? "oklch(0.65 0.2 40 / 0.2)" : "oklch(0.55 0.15 142 / 0.2)"
                  },
                  children: filtered.length
                }
              )
            ]
          },
          key
        );
      }) }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid gap-4 sm:grid-cols-2",
          "data-ocid": "history.loading_state",
          children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {}, i))
        }
      ) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "border border-border rounded-xl p-14 flex flex-col items-center gap-4 bg-card",
          "data-ocid": "history.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-14 h-14 rounded-full flex items-center justify-center",
                style: { background: "oklch(0.55 0.15 142 / 0.08)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  History,
                  {
                    className: "w-7 h-7",
                    style: { color: "oklch(0.55 0.15 142 / 0.5)" }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-semibold text-foreground text-lg", children: "$ No session logs found." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "code-label text-muted-foreground mt-1", children: filter !== "all" ? "Try switching the filter above" : "Start your first meeting" })
            ] }),
            filter === "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                onClick: () => navigate({ to: "/dashboard" }),
                className: "mt-1 font-mono gap-2",
                style: {
                  background: "oklch(0.55 0.15 142 / 0.15)",
                  borderColor: "oklch(0.55 0.15 142 / 0.5)",
                  color: "oklch(0.55 0.15 142)"
                },
                variant: "outline",
                "data-ocid": "history.empty_dashboard_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                  " New Meeting"
                ]
              }
            )
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: filtered.map((entry, idx) => {
        const isHost = entry.role === Variant_host_participant.host;
        const recording = recordingByRoom.get(entry.roomCode);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "group bg-card border border-border rounded-xl p-5 flex flex-col gap-3 cursor-pointer transition-smooth hover:shadow-lg",
            style: {
              borderColor: void 0
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.borderColor = "oklch(0.55 0.15 142 / 0.5)";
              e.currentTarget.style.boxShadow = "0 0 16px 0 oklch(0.55 0.15 142 / 0.15)";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.borderColor = "";
              e.currentTarget.style.boxShadow = "";
            },
            "data-ocid": `history.item.${idx + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: "font-mono font-bold text-xl tracking-widest",
                    style: { color: "oklch(0.55 0.15 142)" },
                    children: [
                      "#",
                      entry.roomCode
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    className: "code-label flex-shrink-0 border-0 px-2 py-0.5",
                    style: {
                      background: isHost ? "oklch(0.55 0.15 142 / 0.15)" : "oklch(0.65 0.2 40 / 0.15)",
                      color: isHost ? "oklch(0.55 0.15 142)" : "oklch(0.65 0.2 40)"
                    },
                    children: isHost ? "Host" : "Participant"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "code-label text-muted-foreground", children: formatDate(entry.date) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "code-label text-muted-foreground flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
                  String(entry.participantCount),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: " participants" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "code-label text-muted-foreground flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }),
                  formatDurationMMSS(entry.durationSeconds)
                ] }),
                recording && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "ml-auto flex items-center gap-1.5 code-label px-2.5 py-1 rounded-lg transition-smooth",
                    style: {
                      background: "oklch(0.65 0.2 40 / 0.1)",
                      color: "oklch(0.65 0.2 40)",
                      border: "1px solid oklch(0.65 0.2 40 / 0.4)"
                    },
                    onMouseEnter: (e) => {
                      e.currentTarget.style.background = "oklch(0.65 0.2 40 / 0.2)";
                    },
                    onMouseLeave: (e) => {
                      e.currentTarget.style.background = "oklch(0.65 0.2 40 / 0.1)";
                    },
                    onClick: (ev) => {
                      ev.stopPropagation();
                      navigate({
                        to: "/recording/$id",
                        params: { id: String(recording.id) }
                      });
                    },
                    "data-ocid": `history.recording_button.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-3.5 h-3.5" }),
                      "Recording",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3" })
                    ]
                  }
                )
              ] }),
              entry.title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-medium truncate border-t border-border pt-2 mt-0.5", children: entry.title })
            ]
          },
          entry.roomCode + String(entry.date)
        );
      }) })
    ] })
  ] }) });
}
export {
  MeetingHistoryPage
};
