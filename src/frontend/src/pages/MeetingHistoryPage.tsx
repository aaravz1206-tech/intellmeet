import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useBackend } from "@/hooks/useBackend";
import type { MeetingHistoryEntry, RecordingInfo } from "@/types";
import { Variant_host_participant } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Camera,
  ChevronRight,
  Clock,
  History,
  Plus,
  Users,
} from "lucide-react";
import { useState } from "react";

type FilterType = "all" | "host" | "participant";

function formatDurationMMSS(secs?: bigint): string {
  if (!secs) return "00:00";
  const s = Number(secs);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-48" />
      <div className="flex gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function MeetingHistoryPage() {
  useAuthGuard({ requireAuth: true });
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>("all");

  const { data: history = [], isLoading: historyLoading } = useQuery<
    MeetingHistoryEntry[]
  >({
    queryKey: ["meetingHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMeetingHistory();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: recordings = [], isLoading: recordingsLoading } = useQuery<
    RecordingInfo[]
  >({
    queryKey: ["myRecordings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMyRecordings();
    },
    enabled: !!actor && !isFetching,
  });

  const isLoading = historyLoading || recordingsLoading || isFetching;

  // Build a room→recording map for quick lookup
  const recordingByRoom = new Map<string, RecordingInfo>();
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
    (e) => e.role === Variant_host_participant.host,
  ).length;
  const joinedCount = history.filter(
    (e) => e.role === Variant_host_participant.participant,
  ).length;

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Page header strip */}
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-6 max-w-5xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-mono font-bold text-2xl text-foreground flex items-center gap-2">
                  <History
                    className="w-6 h-6"
                    style={{ color: "oklch(0.65 0.2 40)" }}
                  />
                  Meeting History
                </h1>
                <p className="text-sm text-muted-foreground mt-1 font-mono">
                  {isLoading ? (
                    <Skeleton className="h-4 w-40 inline-block" />
                  ) : (
                    <>
                      <span className="text-foreground font-semibold">
                        {history.length}
                      </span>{" "}
                      session
                      {history.length !== 1 ? "s" : ""} found
                    </>
                  )}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: "/dashboard" })}
                className="font-mono text-sm border-border hover:border-primary/50 transition-smooth flex-shrink-0"
                data-ocid="history.back_button"
              >
                ← Dashboard
              </Button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              {[
                {
                  label: "Total",
                  value: history.length,
                  color: "text-foreground",
                },
                { label: "As Host", value: hostedCount, color: "text-primary" },
                { label: "As Participant", value: joinedCount, color: "" },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="rounded-lg bg-background border border-border px-4 py-3"
                >
                  <p className="code-label text-muted-foreground">{label}</p>
                  {isLoading ? (
                    <Skeleton className="h-6 w-10 mt-1" />
                  ) : (
                    <p
                      className={`font-mono font-bold text-xl mt-0.5 ${
                        color || "[color:oklch(0.65_0.2_40)]"
                      }`}
                      style={
                        !color ? { color: "oklch(0.65 0.2 40)" } : undefined
                      }
                    >
                      {value}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters + List */}
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          {/* Filter row */}
          <div className="flex gap-2 mb-6" data-ocid="history.filter.tab">
            {(
              [
                { key: "all", label: "All Sessions" },
                { key: "host", label: "Hosted by me" },
                { key: "participant", label: "Joined" },
              ] as { key: FilterType; label: string }[]
            ).map(({ key, label }) => {
              const isActive = filter === key;
              const isHost = key === "host";
              const isParticipant = key === "participant";
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  data-ocid={`history.filter_${key}`}
                  className="relative px-4 py-1.5 rounded-lg code-label font-semibold transition-smooth border"
                  style={{
                    background: isActive
                      ? isHost
                        ? "oklch(0.55 0.15 142 / 0.15)"
                        : isParticipant
                          ? "oklch(0.65 0.2 40 / 0.15)"
                          : "oklch(0.55 0.15 142 / 0.1)"
                      : "transparent",
                    borderColor: isActive
                      ? isHost
                        ? "oklch(0.55 0.15 142 / 0.8)"
                        : isParticipant
                          ? "oklch(0.65 0.2 40 / 0.8)"
                          : "oklch(0.55 0.15 142 / 0.5)"
                      : "oklch(0.18 0 0)",
                    color: isActive
                      ? isHost
                        ? "oklch(0.55 0.15 142)"
                        : isParticipant
                          ? "oklch(0.65 0.2 40)"
                          : "oklch(0.55 0.15 142)"
                      : "oklch(0.58 0 0)",
                  }}
                >
                  {label}
                  {isActive && (
                    <span
                      className="ml-2 rounded px-1.5 py-0.5 text-[10px]"
                      style={{
                        background: isParticipant
                          ? "oklch(0.65 0.2 40 / 0.2)"
                          : "oklch(0.55 0.15 142 / 0.2)",
                      }}
                    >
                      {filtered.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Content */}
          {isLoading ? (
            <div
              className="grid gap-4 sm:grid-cols-2"
              data-ocid="history.loading_state"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="border border-border rounded-xl p-14 flex flex-col items-center gap-4 bg-card"
              data-ocid="history.empty_state"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "oklch(0.55 0.15 142 / 0.08)" }}
              >
                <History
                  className="w-7 h-7"
                  style={{ color: "oklch(0.55 0.15 142 / 0.5)" }}
                />
              </div>
              <div className="text-center">
                <p className="font-mono font-semibold text-foreground text-lg">
                  $ No session logs found.
                </p>
                <p className="code-label text-muted-foreground mt-1">
                  {filter !== "all"
                    ? "Try switching the filter above"
                    : "Start your first meeting"}
                </p>
              </div>
              {filter === "all" && (
                <Button
                  type="button"
                  onClick={() => navigate({ to: "/dashboard" })}
                  className="mt-1 font-mono gap-2"
                  style={{
                    background: "oklch(0.55 0.15 142 / 0.15)",
                    borderColor: "oklch(0.55 0.15 142 / 0.5)",
                    color: "oklch(0.55 0.15 142)",
                  }}
                  variant="outline"
                  data-ocid="history.empty_dashboard_button"
                >
                  <Plus className="w-4 h-4" /> New Meeting
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((entry, idx) => {
                const isHost = entry.role === Variant_host_participant.host;
                const recording = recordingByRoom.get(entry.roomCode);
                return (
                  <div
                    key={entry.roomCode + String(entry.date)}
                    className="group bg-card border border-border rounded-xl p-5 flex flex-col gap-3 cursor-pointer transition-smooth hover:shadow-lg"
                    style={{
                      borderColor: undefined,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "oklch(0.55 0.15 142 / 0.5)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        "0 0 16px 0 oklch(0.55 0.15 142 / 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                    }}
                    data-ocid={`history.item.${idx + 1}`}
                  >
                    {/* Room code + role badge */}
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className="font-mono font-bold text-xl tracking-widest"
                        style={{ color: "oklch(0.55 0.15 142)" }}
                      >
                        #{entry.roomCode}
                      </p>
                      <Badge
                        className="code-label flex-shrink-0 border-0 px-2 py-0.5"
                        style={{
                          background: isHost
                            ? "oklch(0.55 0.15 142 / 0.15)"
                            : "oklch(0.65 0.2 40 / 0.15)",
                          color: isHost
                            ? "oklch(0.55 0.15 142)"
                            : "oklch(0.65 0.2 40)",
                        }}
                      >
                        {isHost ? "Host" : "Participant"}
                      </Badge>
                    </div>

                    {/* Date */}
                    <p className="code-label text-muted-foreground">
                      {formatDate(entry.date)}
                    </p>

                    {/* Meta row */}
                    <div className="flex items-center gap-4">
                      <span className="code-label text-muted-foreground flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {String(entry.participantCount)}
                        <span className="hidden sm:inline"> participants</span>
                      </span>
                      <span className="code-label text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDurationMMSS(entry.durationSeconds)}
                      </span>
                      {recording && (
                        <button
                          type="button"
                          className="ml-auto flex items-center gap-1.5 code-label px-2.5 py-1 rounded-lg transition-smooth"
                          style={{
                            background: "oklch(0.65 0.2 40 / 0.1)",
                            color: "oklch(0.65 0.2 40)",
                            border: "1px solid oklch(0.65 0.2 40 / 0.4)",
                          }}
                          onMouseEnter={(e) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = "oklch(0.65 0.2 40 / 0.2)";
                          }}
                          onMouseLeave={(e) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = "oklch(0.65 0.2 40 / 0.1)";
                          }}
                          onClick={(ev) => {
                            ev.stopPropagation();
                            navigate({
                              to: "/recording/$id",
                              params: { id: String(recording.id) },
                            });
                          }}
                          data-ocid={`history.recording_button.${idx + 1}`}
                        >
                          <Camera className="w-3.5 h-3.5" />
                          Recording
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Title */}
                    {entry.title && (
                      <p className="text-sm text-foreground font-medium truncate border-t border-border pt-2 mt-0.5">
                        {entry.title}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
