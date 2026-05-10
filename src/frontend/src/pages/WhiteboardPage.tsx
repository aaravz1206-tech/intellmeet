import { Button } from "@/components/ui/button";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useBackend } from "@/hooks/useBackend";
import type { StrokeInfo } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Eraser,
  Pencil,
  RotateCcw,
  Trash2,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Color Palette ─────────────────────────────────────────────────────────────
const PALETTE: { label: string; hex: string }[] = [
  { label: "Emerald", hex: "#10b981" },
  { label: "Amber", hex: "#f59e0b" },
  { label: "White", hex: "#f8fafc" },
  { label: "Red", hex: "#ef4444" },
  { label: "Slate", hex: "#475569" },
];

type Tool = "pen" | "eraser";

interface Point {
  x: number;
  y: number;
}

interface LocalStroke {
  id: string;
  color: string;
  width: number;
  points: Point[];
}

// ─── Drawing helpers ────────────────────────────────────────────────────────────
function renderStrokesOnCtx(
  ctx: CanvasRenderingContext2D,
  strokes: Pick<LocalStroke, "color" | "width" | "points">[],
) {
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

function parseRemoteStrokes(
  raw: StrokeInfo[],
  canvasW: number,
  canvasH: number,
): Pick<LocalStroke, "color" | "width" | "points">[] {
  return raw.flatMap((s) => {
    try {
      const pts: Point[] = JSON.parse(s.path);
      // Points are stored normalized 0–1; scale back to canvas dimensions
      const scaled = pts.map((p) => ({
        x: p.x <= 1 ? p.x * canvasW : p.x,
        y: p.y <= 1 ? p.y * canvasH : p.y,
      }));
      return [{ color: s.color, width: Number(s.width), points: scaled }];
    } catch {
      return [];
    }
  });
}

// Unique colours per remote drawer
const DRAWER_COLORS = ["#10b981", "#f59e0b", "#ef4444", "#f8fafc", "#475569"];

export function WhiteboardPage() {
  useAuthGuard({ requireAuth: true });
  const { roomCode } = useParams({ from: "/whiteboard/$roomCode" });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const qc = useQueryClient();

  // ── Tool state ────────────────────────────────────────────────────────────
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState<string>(PALETTE[0].hex);
  const [brushSize, setBrushSize] = useState<number>(4);

  // ── Canvas refs ───────────────────────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);
  const pathRef = useRef<Point[]>([]);

  // ── Local undo stack (last 10) ────────────────────────────────────────────
  const localStackRef = useRef<LocalStroke[]>([]);
  const [undoCount, setUndoCount] = useState<number>(0); // triggers re-render

  // ── Last synced count to detect new remote strokes ─────────────────────────
  const lastSyncedCountRef = useRef<number>(0);

  // ─── Poll remote strokes every 1 s ─────────────────────────────────────────
  const { data: remoteStrokes = [] } = useQuery<StrokeInfo[]>({
    queryKey: ["strokes", roomCode],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStrokes(roomCode);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 1000,
  });

  // ── Active drawers derived from polled remote strokes ──────────────────────
  // Count unique colours seen in the last fetch as a proxy for active participants
  const activeDrawers =
    remoteStrokes.length > 0
      ? Math.min(
          new Set(remoteStrokes.map((s) => s.color)).size,
          DRAWER_COLORS.length,
        )
      : 0;

  // ─── Full re-render: remote strokes + local stack overlay ──────────────────
  const redrawAll = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Remote strokes
    const parsed = parseRemoteStrokes(
      remoteStrokes,
      canvas.width,
      canvas.height,
    );
    renderStrokesOnCtx(ctx, parsed);
    // Local stack on top
    renderStrokesOnCtx(ctx, localStackRef.current);
  }, [remoteStrokes]);

  // Redraw whenever remote data changes
  useEffect(() => {
    redrawAll();
    lastSyncedCountRef.current = remoteStrokes.length;
  }, [redrawAll, remoteStrokes]);

  // ─── Canvas resize ─────────────────────────────────────────────────────────
  useEffect(() => {
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

  // ─── Keyboard undo ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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

  // ─── Pointer helpers ───────────────────────────────────────────────────────
  const getPosFromMouse = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const getPosFromTouch = (e: React.TouchEvent<HTMLCanvasElement>): Point => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const t = e.touches[0];
    return { x: t.clientX - rect.left, y: t.clientY - rect.top };
  };

  // ─── Drawing core ──────────────────────────────────────────────────────────
  const startPath = (pt: Point) => {
    drawingRef.current = true;
    pathRef.current = [pt];
  };

  const continuePath = (pt: Point) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
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

  const endPath = useCallback(async () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const pts = pathRef.current;
    if (pts.length < 2) {
      pathRef.current = [];
      return;
    }

    // Normalize to 0-1 range for storage
    const canvas = canvasRef.current!;
    const normPts = pts.map((p) => ({
      x: Number.parseFloat((p.x / canvas.width).toFixed(4)),
      y: Number.parseFloat((p.y / canvas.height).toFixed(4)),
    }));

    const strokeColor = tool === "eraser" ? "#020617" : color;
    const strokeWidth = tool === "eraser" ? brushSize * 2 : brushSize;

    // Push to local stack (capped at 10)
    const stroke: LocalStroke = {
      id: `local-${Date.now()}`,
      color: strokeColor,
      width: strokeWidth,
      points: pts,
    };
    localStackRef.current = [...localStackRef.current.slice(-9), stroke];
    setUndoCount((c) => c + 1);
    pathRef.current = [];

    // Sync to backend
    if (actor) {
      try {
        await actor.addStroke(
          roomCode,
          strokeColor,
          BigInt(strokeWidth),
          JSON.stringify(normPts),
        );
        qc.invalidateQueries({ queryKey: ["strokes", roomCode] });
      } catch {
        toast.error("Failed to sync stroke");
      }
    }
  }, [actor, roomCode, color, brushSize, tool, qc]);

  // ─── Clear whiteboard ──────────────────────────────────────────────────────
  const clearBoard = async () => {
    if (!actor) return;
    try {
      await actor.clearWhiteboard(roomCode);
      localStackRef.current = [];
      setUndoCount((c) => c + 1);
      const canvas = canvasRef.current;
      canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
      qc.invalidateQueries({ queryKey: ["strokes", roomCode] });
      toast.success("Whiteboard cleared");
    } catch {
      toast.error("Failed to clear whiteboard");
    }
  };

  // ─── Undo button ───────────────────────────────────────────────────────────
  const handleUndo = () => {
    if (localStackRef.current.length === 0) return;
    localStackRef.current = localStackRef.current.slice(0, -1);
    setUndoCount((c) => c + 1);
    redrawAll();
  };

  const canUndo = undoCount >= 0 && localStackRef.current.length > 0;

  // ─── Mouse event handlers ──────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) =>
    startPath(getPosFromMouse(e));
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) =>
    continuePath(getPosFromMouse(e));
  const onMouseUp = () => endPath();
  const onMouseLeave = () => {
    if (drawingRef.current) endPath();
  };

  // ─── Touch event handlers ──────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    startPath(getPosFromTouch(e));
  };
  const onTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    continuePath(getPosFromTouch(e));
  };
  const onTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    endPath();
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* ── Header / toolbar ────────────────────────────────────────────── */}
      <header
        className="flex items-center gap-2 px-3 py-2 bg-card border-b border-primary/20 flex-shrink-0"
        style={{ boxShadow: "0 0 12px 0 oklch(0.55 0.15 142 / 0.12)" }}
      >
        {/* Back button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary"
          onClick={() => navigate({ to: `/meeting/${roomCode}` as never })}
          aria-label="Back to meeting room"
          data-ocid="whiteboard.back_button"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5">
          <span className="code-label text-muted-foreground">Whiteboard</span>
          <span className="code-label text-muted-foreground">/</span>
          <span className="code-label font-bold" style={{ color: "#10b981" }}>
            {roomCode}
          </span>
        </div>

        <div className="h-4 w-px bg-border mx-2" />

        {/* Tool selector */}
        <div
          className="flex items-center gap-1"
          role="toolbar"
          aria-label="Drawing tools"
        >
          <button
            type="button"
            aria-label="Pen tool"
            aria-pressed={tool === "pen"}
            onClick={() => setTool("pen")}
            data-ocid="whiteboard.pen_tool"
            className={[
              "flex items-center gap-1 px-2.5 py-1.5 rounded text-xs code-label transition-smooth",
              tool === "pen"
                ? "text-primary bg-primary/10 border border-primary/50 glow-emerald"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent",
            ].join(" ")}
          >
            <Pencil className="h-3.5 w-3.5" />
            <span>Pen</span>
          </button>

          <button
            type="button"
            aria-label="Eraser tool"
            aria-pressed={tool === "eraser"}
            onClick={() => setTool("eraser")}
            data-ocid="whiteboard.eraser_tool"
            className={[
              "flex items-center gap-1 px-2.5 py-1.5 rounded text-xs code-label transition-smooth",
              tool === "eraser"
                ? "text-accent bg-accent/10 border border-accent/50"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent",
            ].join(" ")}
          >
            <Eraser className="h-3.5 w-3.5" />
            <span>Eraser</span>
          </button>
        </div>

        <div className="h-4 w-px bg-border mx-2" />

        {/* Color palette */}
        <fieldset
          className="flex items-center gap-1.5 border-none p-0 m-0"
          aria-label="Color palette"
        >
          {PALETTE.map((p) => {
            const isActive = color === p.hex && tool === "pen";
            return (
              <button
                key={p.hex}
                type="button"
                aria-label={`${p.label} color`}
                aria-pressed={isActive}
                onClick={() => {
                  setColor(p.hex);
                  setTool("pen");
                }}
                data-ocid={`whiteboard.color_${p.label.toLowerCase()}`}
                className="w-5 h-5 rounded-full transition-smooth focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                style={{
                  backgroundColor: p.hex,
                  border: isActive
                    ? "2px solid #f8fafc"
                    : "2px solid transparent",
                  boxShadow: isActive ? `0 0 8px 2px ${p.hex}99` : "none",
                  transform: isActive ? "scale(1.2)" : "scale(1)",
                }}
              />
            );
          })}

          <div className="h-4 w-px bg-border mx-2" />

          {/* Brush size slider */}
        </fieldset>
        <div className="flex items-center gap-2">
          <span className="code-label text-muted-foreground text-xs">Size</span>
          <input
            type="range"
            min={1}
            max={20}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            aria-label="Brush size"
            data-ocid="whiteboard.brush_slider"
            className="w-20 accent-primary h-1"
          />
          <span
            className="code-label text-foreground w-5 text-center text-xs tabular-nums"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {brushSize}
          </span>
        </div>

        <div className="h-4 w-px bg-border mx-2" />

        {/* Undo button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleUndo}
          disabled={!canUndo}
          className="h-7 px-2 code-label text-xs text-muted-foreground hover:text-foreground"
          data-ocid="whiteboard.undo_button"
          title="Undo (Ctrl+Z)"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Undo
        </Button>

        {/* Clear board */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearBoard}
          className="h-7 px-2 code-label text-xs border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
          data-ocid="whiteboard.clear_button"
        >
          <Trash2 className="h-3 w-3 mr-1" /> Clear All
        </Button>

        <div className="flex-1" />

        {/* Active participant dots */}
        <div
          className="flex items-center gap-1.5"
          aria-label={`${activeDrawers} active participants`}
          data-ocid="whiteboard.active_drawers"
        >
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <div className="flex items-center gap-0.5">
            {DRAWER_COLORS.slice(0, activeDrawers).map((color, i) => (
              <span
                key={color}
                className="w-2.5 h-2.5 rounded-full border border-background"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 4px ${color}88`,
                }}
                title={`Participant ${i + 1}`}
              />
            ))}
          </div>
          <span className="code-label text-muted-foreground text-xs">
            {activeDrawers} active
          </span>
        </div>
      </header>

      {/* ── Canvas area ─────────────────────────────────────────────────── */}
      <main
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        style={{
          background: "#020617",
          backgroundImage:
            "linear-gradient(oklch(0.55 0.15 142 / 0.07) 1px, transparent 1px)," +
            "linear-gradient(90deg, oklch(0.55 0.15 142 / 0.07) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      >
        <canvas
          ref={canvasRef}
          className={[
            "absolute inset-0 w-full h-full",
            tool === "eraser" ? "cursor-cell" : "cursor-crosshair",
          ].join(" ")}
          style={{ touchAction: "none" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          data-ocid="whiteboard.canvas_target"
        />

        {/* Corner watermark */}
        <div className="absolute bottom-3 right-4 pointer-events-none select-none">
          <span
            className="code-label text-xs"
            style={{ color: "oklch(0.55 0.15 142 / 0.25)" }}
          >
            IntellMeet Whiteboard · {roomCode}
          </span>
        </div>

        {/* Live cursor tool indicator */}
        <div className="absolute top-3 left-4 pointer-events-none select-none">
          <span
            className="code-label text-xs px-2 py-1 rounded"
            style={{
              background: "oklch(0.11 0 0 / 0.8)",
              border: "1px solid oklch(0.55 0.15 142 / 0.25)",
              color: tool === "eraser" ? "#f59e0b" : color,
            }}
          >
            {tool === "eraser" ? "◌ Eraser" : "✦ Pen"} · {brushSize}px
          </span>
        </div>
      </main>
    </div>
  );
}
