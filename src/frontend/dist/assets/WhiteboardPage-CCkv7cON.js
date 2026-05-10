import { c as useParams, a as useNavigate, b as useQueryClient, r as reactExports, j as jsxRuntimeExports } from "./index-DuPiBNs4.js";
import { c as createLucideIcon, u as useAuthGuard, B as Button } from "./createLucideIcon-DskF2vxw.js";
import { u as useBackend, a as useQuery, U as Users } from "./useBackend-BtzrIPd3.js";
import { u as ue } from "./index-WVRWQld7.js";
import { A as ArrowLeft } from "./arrow-left-GcjwSzvM.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21",
      key: "182aya"
    }
  ],
  ["path", { d: "M22 21H7", key: "t4ddhn" }],
  ["path", { d: "m5 11 9 9", key: "1mo9qw" }]
];
const Eraser = createLucideIcon("eraser", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
const PALETTE = [
  { label: "Emerald", hex: "#10b981" },
  { label: "Amber", hex: "#f59e0b" },
  { label: "White", hex: "#f8fafc" },
  { label: "Red", hex: "#ef4444" },
  { label: "Slate", hex: "#475569" }
];
function renderStrokesOnCtx(ctx, strokes) {
  for (const s of strokes) {
    if (s.points.length < 2) continue;
    ctx.beginPath();
    ctx.strokeStyle = s.color;
    ctx.lineWidth = s.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.moveTo(s.points[0].x, s.points[0].y);
    for (let i = 1; i < s.points.length; i++)
      ctx.lineTo(s.points[i].x, s.points[i].y);
    ctx.stroke();
  }
}
function parseRemoteStrokes(raw, canvasW, canvasH) {
  return raw.flatMap((s) => {
    try {
      const pts = JSON.parse(s.path);
      const scaled = pts.map((p) => ({
        x: p.x <= 1 ? p.x * canvasW : p.x,
        y: p.y <= 1 ? p.y * canvasH : p.y
      }));
      return [{ color: s.color, width: Number(s.width), points: scaled }];
    } catch {
      return [];
    }
  });
}
const DRAWER_COLORS = ["#10b981", "#f59e0b", "#ef4444", "#f8fafc", "#475569"];
function WhiteboardPage() {
  useAuthGuard({ requireAuth: true });
  const { roomCode } = useParams({ from: "/whiteboard/$roomCode" });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const qc = useQueryClient();
  const [tool, setTool] = reactExports.useState("pen");
  const [color, setColor] = reactExports.useState(PALETTE[0].hex);
  const [brushSize, setBrushSize] = reactExports.useState(4);
  const canvasRef = reactExports.useRef(null);
  const containerRef = reactExports.useRef(null);
  const drawingRef = reactExports.useRef(false);
  const pathRef = reactExports.useRef([]);
  const localStackRef = reactExports.useRef([]);
  const [undoCount, setUndoCount] = reactExports.useState(0);
  const lastSyncedCountRef = reactExports.useRef(0);
  const { data: remoteStrokes = [] } = useQuery({
    queryKey: ["strokes", roomCode],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStrokes(roomCode);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 1e3
  });
  const activeDrawers = remoteStrokes.length > 0 ? Math.min(
    new Set(remoteStrokes.map((s) => s.color)).size,
    DRAWER_COLORS.length
  ) : 0;
  const redrawAll = reactExports.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const parsed = parseRemoteStrokes(
      remoteStrokes,
      canvas.width,
      canvas.height
    );
    renderStrokesOnCtx(ctx, parsed);
    renderStrokesOnCtx(ctx, localStackRef.current);
  }, [remoteStrokes]);
  reactExports.useEffect(() => {
    redrawAll();
    lastSyncedCountRef.current = remoteStrokes.length;
  }, [redrawAll, remoteStrokes]);
  reactExports.useEffect(() => {
    const resize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;
      const { width, height } = container.getBoundingClientRect();
      canvas.width = Math.floor(width);
      canvas.height = Math.floor(height);
      redrawAll();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [redrawAll]);
  reactExports.useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (localStackRef.current.length === 0) return;
        localStackRef.current = localStackRef.current.slice(0, -1);
        setUndoCount((c) => c + 1);
        redrawAll();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [redrawAll]);
  const getPosFromMouse = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const getPosFromTouch = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const t = e.touches[0];
    return { x: t.clientX - rect.left, y: t.clientY - rect.top };
  };
  const startPath = (pt) => {
    drawingRef.current = true;
    pathRef.current = [pt];
  };
  const continuePath = (pt) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas == null ? void 0 : canvas.getContext("2d");
    if (!ctx || !canvas) return;
    pathRef.current.push(pt);
    const pts = pathRef.current;
    if (pts.length < 2) return;
    if (tool === "eraser") {
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, brushSize * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.stroke();
    }
  };
  const endPath = reactExports.useCallback(async () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const pts = pathRef.current;
    if (pts.length < 2) {
      pathRef.current = [];
      return;
    }
    const canvas = canvasRef.current;
    const normPts = pts.map((p) => ({
      x: Number.parseFloat((p.x / canvas.width).toFixed(4)),
      y: Number.parseFloat((p.y / canvas.height).toFixed(4))
    }));
    const strokeColor = tool === "eraser" ? "#020617" : color;
    const strokeWidth = tool === "eraser" ? brushSize * 2 : brushSize;
    const stroke = {
      id: `local-${Date.now()}`,
      color: strokeColor,
      width: strokeWidth,
      points: pts
    };
    localStackRef.current = [...localStackRef.current.slice(-9), stroke];
    setUndoCount((c) => c + 1);
    pathRef.current = [];
    if (actor) {
      try {
        await actor.addStroke(
          roomCode,
          strokeColor,
          BigInt(strokeWidth),
          JSON.stringify(normPts)
        );
        qc.invalidateQueries({ queryKey: ["strokes", roomCode] });
      } catch {
        ue.error("Failed to sync stroke");
      }
    }
  }, [actor, roomCode, color, brushSize, tool, qc]);
  const clearBoard = async () => {
    var _a;
    if (!actor) return;
    try {
      await actor.clearWhiteboard(roomCode);
      localStackRef.current = [];
      setUndoCount((c) => c + 1);
      const canvas = canvasRef.current;
      (_a = canvas == null ? void 0 : canvas.getContext("2d")) == null ? void 0 : _a.clearRect(0, 0, canvas.width, canvas.height);
      qc.invalidateQueries({ queryKey: ["strokes", roomCode] });
      ue.success("Whiteboard cleared");
    } catch {
      ue.error("Failed to clear whiteboard");
    }
  };
  const handleUndo = () => {
    if (localStackRef.current.length === 0) return;
    localStackRef.current = localStackRef.current.slice(0, -1);
    setUndoCount((c) => c + 1);
    redrawAll();
  };
  const canUndo = undoCount >= 0 && localStackRef.current.length > 0;
  const onMouseDown = (e) => startPath(getPosFromMouse(e));
  const onMouseMove = (e) => continuePath(getPosFromMouse(e));
  const onMouseUp = () => endPath();
  const onMouseLeave = () => {
    if (drawingRef.current) endPath();
  };
  const onTouchStart = (e) => {
    e.preventDefault();
    startPath(getPosFromTouch(e));
  };
  const onTouchMove = (e) => {
    e.preventDefault();
    continuePath(getPosFromTouch(e));
  };
  const onTouchEnd = (e) => {
    e.preventDefault();
    endPath();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-screen flex flex-col overflow-hidden bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "header",
      {
        className: "flex items-center gap-2 px-3 py-2 bg-card border-b border-primary/20 flex-shrink-0",
        style: { boxShadow: "0 0 12px 0 oklch(0.55 0.15 142 / 0.12)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "icon",
              className: "h-8 w-8 text-muted-foreground hover:text-primary",
              onClick: () => navigate({ to: `/meeting/${roomCode}` }),
              "aria-label": "Back to meeting room",
              "data-ocid": "whiteboard.back_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "code-label text-muted-foreground", children: "Whiteboard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "code-label text-muted-foreground", children: "/" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "code-label font-bold", style: { color: "#10b981" }, children: roomCode })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-px bg-border mx-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-1",
              role: "toolbar",
              "aria-label": "Drawing tools",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "aria-label": "Pen tool",
                    "aria-pressed": tool === "pen",
                    onClick: () => setTool("pen"),
                    "data-ocid": "whiteboard.pen_tool",
                    className: [
                      "flex items-center gap-1 px-2.5 py-1.5 rounded text-xs code-label transition-smooth",
                      tool === "pen" ? "text-primary bg-primary/10 border border-primary/50 glow-emerald" : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
                    ].join(" "),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Pen" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "aria-label": "Eraser tool",
                    "aria-pressed": tool === "eraser",
                    onClick: () => setTool("eraser"),
                    "data-ocid": "whiteboard.eraser_tool",
                    className: [
                      "flex items-center gap-1 px-2.5 py-1.5 rounded text-xs code-label transition-smooth",
                      tool === "eraser" ? "text-accent bg-accent/10 border border-accent/50" : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
                    ].join(" "),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Eraser, { className: "h-3.5 w-3.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Eraser" })
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-px bg-border mx-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "fieldset",
            {
              className: "flex items-center gap-1.5 border-none p-0 m-0",
              "aria-label": "Color palette",
              children: [
                PALETTE.map((p) => {
                  const isActive = color === p.hex && tool === "pen";
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": `${p.label} color`,
                      "aria-pressed": isActive,
                      onClick: () => {
                        setColor(p.hex);
                        setTool("pen");
                      },
                      "data-ocid": `whiteboard.color_${p.label.toLowerCase()}`,
                      className: "w-5 h-5 rounded-full transition-smooth focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                      style: {
                        backgroundColor: p.hex,
                        border: isActive ? "2px solid #f8fafc" : "2px solid transparent",
                        boxShadow: isActive ? `0 0 8px 2px ${p.hex}99` : "none",
                        transform: isActive ? "scale(1.2)" : "scale(1)"
                      }
                    },
                    p.hex
                  );
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-px bg-border mx-2" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "code-label text-muted-foreground text-xs", children: "Size" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "range",
                min: 1,
                max: 20,
                value: brushSize,
                onChange: (e) => setBrushSize(Number(e.target.value)),
                "aria-label": "Brush size",
                "data-ocid": "whiteboard.brush_slider",
                className: "w-20 accent-primary h-1"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "code-label text-foreground w-5 text-center text-xs tabular-nums",
                style: { fontFamily: "var(--font-mono)" },
                children: brushSize
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-px bg-border mx-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: handleUndo,
              disabled: !canUndo,
              className: "h-7 px-2 code-label text-xs text-muted-foreground hover:text-foreground",
              "data-ocid": "whiteboard.undo_button",
              title: "Undo (Ctrl+Z)",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3 w-3 mr-1" }),
                "Undo"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              onClick: clearBoard,
              className: "h-7 px-2 code-label text-xs border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive",
              "data-ocid": "whiteboard.clear_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3 mr-1" }),
                " Clear All"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-1.5",
              "aria-label": `${activeDrawers} active participants`,
              "data-ocid": "whiteboard.active_drawers",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0.5", children: DRAWER_COLORS.slice(0, activeDrawers).map((color2, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "w-2.5 h-2.5 rounded-full border border-background",
                    style: {
                      backgroundColor: color2,
                      boxShadow: `0 0 4px ${color2}88`
                    },
                    title: `Participant ${i + 1}`
                  },
                  color2
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "code-label text-muted-foreground text-xs", children: [
                  activeDrawers,
                  " active"
                ] })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "main",
      {
        ref: containerRef,
        className: "flex-1 relative overflow-hidden",
        style: {
          background: "#020617",
          backgroundImage: "linear-gradient(oklch(0.55 0.15 142 / 0.07) 1px, transparent 1px),linear-gradient(90deg, oklch(0.55 0.15 142 / 0.07) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "canvas",
            {
              ref: canvasRef,
              className: [
                "absolute inset-0 w-full h-full",
                tool === "eraser" ? "cursor-cell" : "cursor-crosshair"
              ].join(" "),
              style: { touchAction: "none" },
              onMouseDown,
              onMouseMove,
              onMouseUp,
              onMouseLeave,
              onTouchStart,
              onTouchMove,
              onTouchEnd,
              "data-ocid": "whiteboard.canvas_target"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 right-4 pointer-events-none select-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "code-label text-xs",
              style: { color: "oklch(0.55 0.15 142 / 0.25)" },
              children: [
                "IntellMeet Whiteboard · ",
                roomCode
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 left-4 pointer-events-none select-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "code-label text-xs px-2 py-1 rounded",
              style: {
                background: "oklch(0.11 0 0 / 0.8)",
                border: "1px solid oklch(0.55 0.15 142 / 0.25)",
                color: tool === "eraser" ? "#f59e0b" : color
              },
              children: [
                tool === "eraser" ? "◌ Eraser" : "✦ Pen",
                " · ",
                brushSize,
                "px"
              ]
            }
          ) })
        ]
      }
    )
  ] });
}
export {
  WhiteboardPage
};
