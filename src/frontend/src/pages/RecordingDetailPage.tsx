import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useBackend } from "@/hooks/useBackend";
import type { RecordingInfo } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Clock,
  Download,
  Film,
  HardDrive,
  History,
  Share2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

function formatDurationMMSS(secs: bigint): string {
  const s = Number(secs);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFileSize(bytes?: bigint): string {
  if (!bytes) return "Unknown";
  const b = Number(bytes);
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1024 * 1024 * 1024) return `${(b / 1024 / 1024).toFixed(1)} MB`;
  return `${(b / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function MetaStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="code-label text-muted-foreground flex items-center gap-1">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>
      <span className="font-mono text-sm text-foreground">{value}</span>
    </div>
  );
}

export function RecordingDetailPage() {
  useAuthGuard({ requireAuth: true });
  const { id } = useParams({ from: "/recording/$id" });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();

  const { data: recording, isLoading } = useQuery<RecordingInfo | null>({
    queryKey: ["recording", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getRecordingById(BigInt(id));
    },
    enabled: !!actor && !isFetching,
  });

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success("Link copied to clipboard!", {
        description: "Share this recording with your team.",
      });
    });
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Breadcrumb bar */}
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 max-w-5xl">
            <nav
              className="flex items-center gap-1.5 text-sm"
              aria-label="Breadcrumb"
            >
              <button
                type="button"
                onClick={() => navigate({ to: "/history" })}
                className="code-label text-muted-foreground hover:text-primary transition-smooth flex items-center gap-1"
                data-ocid="recording.breadcrumb_history"
              >
                <History className="w-3.5 h-3.5" />
                Meeting History
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
              <span
                className="code-label"
                style={{ color: "oklch(0.65 0.2 40)" }}
              >
                Recording #{id}
              </span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Back */}
          <Button
            type="button"
            variant="ghost"
            className="font-mono text-sm text-muted-foreground hover:text-primary -ml-2 mb-6"
            onClick={() => navigate({ to: "/history" })}
            data-ocid="recording.back_button"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to History
          </Button>

          {/* Loading */}
          {isLoading || isFetching ? (
            <div className="space-y-5" data-ocid="recording.loading_state">
              <Skeleton className="w-full aspect-video rounded-xl" />
              <div className="flex gap-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 w-28" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-28" />
                  </div>
                ))}
              </div>
            </div>
          ) : !recording ? (
            /* Not found */
            <div
              className="border rounded-xl p-14 flex flex-col items-center gap-4"
              style={{
                borderColor: "oklch(0.65 0.2 40 / 0.4)",
                background: "oklch(0.65 0.2 40 / 0.06)",
              }}
              data-ocid="recording.error_state"
            >
              <AlertTriangle
                className="w-12 h-12"
                style={{ color: "oklch(0.65 0.2 40)" }}
              />
              <div className="text-center">
                <p className="font-mono font-semibold text-foreground text-lg">
                  Recording not available
                </p>
                <p className="code-label text-muted-foreground mt-1">
                  This recording may have been deleted or the link is invalid.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-1 font-mono gap-2"
                style={{
                  borderColor: "oklch(0.65 0.2 40 / 0.5)",
                  color: "oklch(0.65 0.2 40)",
                }}
                onClick={() => navigate({ to: "/history" })}
                data-ocid="recording.go_history_button"
              >
                <History className="w-4 h-4" /> Back to Meeting History
              </Button>
            </div>
          ) : (
            /* Recording found */
            <div className="space-y-6">
              {/* Video player */}
              <div
                className="rounded-xl overflow-hidden border"
                style={{
                  borderColor: "oklch(0.55 0.15 142 / 0.5)",
                  boxShadow: "0 0 24px 0 oklch(0.55 0.15 142 / 0.2)",
                  background: "oklch(0.05 0 0)",
                }}
              >
                <video
                  src={recording.fileUrl}
                  controls
                  className="w-full aspect-video"
                  style={{ display: "block" }}
                  data-ocid="recording.video_player"
                >
                  <track
                    kind="captions"
                    src=""
                    label="English"
                    srcLang="en"
                    default
                  />
                  Your browser does not support HTML5 video.
                </video>
              </div>

              {/* Title + badge */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="font-mono font-bold text-2xl text-foreground">
                    Recording{" "}
                    <span style={{ color: "oklch(0.55 0.15 142)" }}>#{id}</span>
                  </h1>
                  <p
                    className="font-mono font-semibold text-lg tracking-widest mt-0.5"
                    style={{ color: "oklch(0.55 0.15 142 / 0.8)" }}
                  >
                    #{recording.roomCode}
                  </p>
                </div>
                <Badge
                  className="code-label border-0 px-2.5 py-1 flex-shrink-0"
                  style={{
                    background: "oklch(0.55 0.15 142 / 0.12)",
                    color: "oklch(0.55 0.15 142)",
                  }}
                >
                  <Film className="w-3 h-3 mr-1" /> Video Recording
                </Badge>
              </div>

              {/* Metadata panel */}
              <div className="bg-card border border-border rounded-xl p-5">
                <p className="code-label text-muted-foreground mb-4 flex items-center gap-1">
                  <Film className="w-3.5 h-3.5" /> Recording Details
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                  <MetaStat
                    icon={Clock}
                    label="Duration"
                    value={formatDurationMMSS(recording.durationSeconds)}
                  />
                  <MetaStat
                    icon={Users}
                    label="Participants"
                    value={String(recording.participantsCount)}
                  />
                  <MetaStat
                    icon={Film}
                    label="Recorded"
                    value={formatDate(recording.createdAt)}
                  />
                  <MetaStat
                    icon={HardDrive}
                    label="File Size"
                    value={formatFileSize(undefined)}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={recording.fileUrl}
                  download={`recording-${id}.webm`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm transition-smooth"
                  style={{
                    background: "oklch(0.55 0.15 142 / 0.12)",
                    border: "1px solid oklch(0.55 0.15 142 / 0.4)",
                    color: "oklch(0.55 0.15 142)",
                  }}
                  data-ocid="recording.download_button"
                >
                  <Download className="w-4 h-4" /> Download Recording
                </a>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm transition-smooth"
                  style={{
                    background: "oklch(0.65 0.2 40 / 0.1)",
                    border: "1px solid oklch(0.65 0.2 40 / 0.4)",
                    color: "oklch(0.65 0.2 40)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "oklch(0.65 0.2 40 / 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "oklch(0.65 0.2 40 / 0.1)";
                  }}
                  data-ocid="recording.share_button"
                >
                  <Share2 className="w-4 h-4" /> Share Link
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
