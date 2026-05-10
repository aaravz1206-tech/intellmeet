import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useBackend } from "@/hooks/useBackend";
import { useMeetingStore } from "@/store/meetingStore";
import type { MeetingHistoryEntry } from "@/types";
import { Variant_host_participant } from "@/types";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CalendarClock,
  ChevronRight,
  Clock,
  Film,
  Hash,
  Loader2,
  LogIn,
  Plus,
  Terminal,
  Users,
  Video,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDuration(secs?: bigint): string {
  if (!secs) return "--";
  const s = Number(secs);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accentClass: "emerald" | "amber" | "rose";
  ocid: string;
}

const accentStyles = {
  emerald: {
    glow: "shadow-[0_0_16px_0_oklch(0.55_0.15_142/0.35)]",
    border: "border-[oklch(0.55_0.15_142/0.35)]",
    iconBg: "bg-[oklch(0.55_0.15_142/0.15)]",
    iconColor: "text-primary",
    badgeBg:
      "bg-[oklch(0.55_0.15_142/0.12)] text-primary border-[oklch(0.55_0.15_142/0.4)]",
  },
  amber: {
    glow: "shadow-[0_0_16px_0_oklch(0.65_0.2_40/0.35)]",
    border: "border-[oklch(0.65_0.2_40/0.35)]",
    iconBg: "bg-[oklch(0.65_0.2_40/0.15)]",
    iconColor: "text-accent",
    badgeBg:
      "bg-[oklch(0.65_0.2_40/0.12)] text-accent border-[oklch(0.65_0.2_40/0.4)]",
  },
  rose: {
    glow: "shadow-[0_0_16px_0_oklch(0.6_0.2_25/0.35)]",
    border: "border-[oklch(0.6_0.2_25/0.35)]",
    iconBg: "bg-[oklch(0.6_0.2_25/0.15)]",
    iconColor: "text-destructive",
    badgeBg:
      "bg-[oklch(0.6_0.2_25/0.12)] text-destructive border-[oklch(0.6_0.2_25/0.4)]",
  },
};

function StatCard({ label, value, icon, accentClass, ocid }: StatCardProps) {
  const s = accentStyles[accentClass];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border rounded-xl p-4 flex items-center gap-4 hover:${s.glow} ${s.border} transition-smooth`}
      data-ocid={ocid}
    >
      <div className={`p-2.5 rounded-lg ${s.iconBg} flex-shrink-0`}>
        <span className={s.iconColor}>{icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
          {label}
        </p>
        <p
          className={`text-2xl font-mono font-bold ${s.iconColor} leading-tight`}
        >
          {value}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Terminal Log Line ────────────────────────────────────────────────────────

const LOG_LINES = [
  "System.Log: Connection established.",
  "System.Log: Peer discovery active.",
  "System.Log: Encryption handshake OK.",
  "System.Log: Room registry synced...",
];

function TerminalLog() {
  return (
    <div className="rounded-lg bg-[oklch(0.07_0_0)] border border-[oklch(0.2_0_0)] p-3 mt-3 font-mono text-xs space-y-0.5">
      {LOG_LINES.map((line, i) => (
        <motion.p
          key={line}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + i * 0.12 }}
          className="text-primary/70"
        >
          <span className="text-primary/40 mr-1">›</span>
          {line}
        </motion.p>
      ))}
    </div>
  );
}

// ─── History Skeleton ─────────────────────────────────────────────────────────

function HistorySkeleton() {
  return (
    <div className="space-y-2" data-ocid="dashboard.history_loading_state">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-lg"
        >
          <Skeleton className="h-8 w-8 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-2.5 w-52" />
          </div>
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function DashboardPage() {
  useAuthGuard({ requireAuth: true });
  const { actor, isFetching } = useBackend();
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const setRoom = useMeetingStore((s) => s.setRoom);
  const qc = useQueryClient();

  const [meetingTitle, setMeetingTitle] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  const { data: history = [], isLoading: historyLoading } = useQuery<
    MeetingHistoryEntry[]
  >({
    queryKey: ["meetingHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMeetingHistory();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });

  const recentHistory = history.slice(0, 5);
  const hostCount = history.filter(
    (e) => e.role === Variant_host_participant.host,
  ).length;

  const { data: recordings = [] } = useQuery({
    queryKey: ["myRecordings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMyRecordings();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60_000,
  });
  const recordingCount = recordings.length;

  const createMeeting = async () => {
    if (!actor || !identity) return;
    const title = meetingTitle.trim() || "Untitled Meeting";
    setIsCreating(true);
    try {
      const code = await actor.createRoom(title);
      const userId = identity.getPrincipal().toText();
      setRoom(code, userId);
      await actor.joinRoom(code, "Host");
      qc.invalidateQueries({ queryKey: ["meetingHistory"] });
      navigate({ to: "/meeting/$roomCode", params: { roomCode: code } });
    } catch {
      toast.error("Failed to create meeting");
    } finally {
      setIsCreating(false);
    }
  };

  const joinMeeting = async () => {
    const code = joinCode.trim().toUpperCase();
    if (!code || !actor || !identity) return;
    setJoinError("");
    setIsJoining(true);
    try {
      const roomInfo = await actor.getRoomInfo(code);
      if (!roomInfo) {
        setJoinError("Room not found — check the code and try again.");
        return;
      }
      const ok = await actor.joinRoom(code, "Participant");
      if (!ok) {
        setJoinError("Room is closed or at capacity.");
        return;
      }
      const userId = identity.getPrincipal().toText();
      setRoom(code, userId);
      navigate({ to: "/meeting/$roomCode", params: { roomCode: code } });
    } catch {
      setJoinError("Connection error — please retry.");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-1">
            <Terminal className="w-5 h-5 text-primary" />
            <h1 className="font-mono font-bold text-xl text-foreground tracking-tight">
              Dashboard
            </h1>
          </div>
          <p className="text-sm text-muted-foreground font-mono">
            <span className="text-primary/60">&gt;</span> Initialize or join a
            secure video session
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Total Sessions"
            value={history.length}
            icon={<CalendarClock className="w-5 h-5" />}
            accentClass="amber"
            ocid="dashboard.stat_total"
          />
          <StatCard
            label="As Host"
            value={hostCount}
            icon={<Users className="w-5 h-5" />}
            accentClass="emerald"
            ocid="dashboard.stat_host"
          />
          <StatCard
            label="Recordings"
            value={recordingCount}
            icon={<Film className="w-5 h-5" />}
            accentClass="rose"
            ocid="dashboard.stat_recordings"
          />
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {/* Create Meeting */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card border border-[oklch(0.55_0.15_142/0.4)] rounded-xl p-6 flex flex-col gap-4 hover:shadow-[0_0_24px_0_oklch(0.55_0.15_142/0.2)] transition-smooth"
            data-ocid="dashboard.create_meeting_card"
          >
            {/* Card header */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[oklch(0.55_0.15_142/0.12)] rounded-lg border border-[oklch(0.55_0.15_142/0.25)]">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-mono font-semibold text-foreground">
                  Create a Meeting
                </h2>
                <p className="text-xs text-muted-foreground">
                  Start a new encrypted video session
                </p>
              </div>
            </div>

            {/* Title input */}
            <Input
              placeholder="Meeting title (optional)"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createMeeting()}
              className="bg-background border-border font-mono text-sm placeholder:text-muted-foreground/40"
              data-ocid="dashboard.meeting_title_input"
            />

            {/* CTA */}
            <Button
              type="button"
              onClick={createMeeting}
              disabled={isCreating || !actor}
              className="w-full font-mono glow-emerald hover:glow-emerald-active transition-smooth"
              data-ocid="dashboard.create_meeting_button"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
                  Initializing...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" /> Create Meeting
                </>
              )}
            </Button>

            {/* Terminal log decoration */}
            <TerminalLog />
          </motion.div>

          {/* Join Meeting */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-[oklch(0.65_0.2_40/0.4)] rounded-xl p-6 flex flex-col gap-4 hover:shadow-[0_0_24px_0_oklch(0.65_0.2_40/0.18)] transition-smooth"
            data-ocid="dashboard.join_meeting_card"
          >
            {/* Card header */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[oklch(0.65_0.2_40/0.12)] rounded-lg border border-[oklch(0.65_0.2_40/0.25)]">
                <Hash className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="font-mono font-semibold text-foreground">
                  Join with Code
                </h2>
                <p className="text-xs text-muted-foreground">
                  Enter a room code to connect
                </p>
              </div>
            </div>

            {/* Code input */}
            <div className="space-y-1.5">
              <Input
                placeholder="ENTER ROOM CODE"
                value={joinCode}
                onChange={(e) => {
                  setJoinCode(e.target.value.toUpperCase());
                  setJoinError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && joinMeeting()}
                className="bg-background border-border font-mono text-sm tracking-[0.18em] placeholder:text-muted-foreground/40 uppercase"
                data-ocid="dashboard.join_code_input"
              />
              {joinError && (
                <div
                  className="flex items-center gap-1.5 text-xs font-mono text-accent"
                  data-ocid="dashboard.join_error_state"
                >
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {joinError}
                </div>
              )}
            </div>

            {/* Join button */}
            <Button
              type="button"
              variant="outline"
              onClick={joinMeeting}
              disabled={isJoining || !joinCode.trim() || !actor}
              className="w-full font-mono border-[oklch(0.65_0.2_40/0.45)] text-accent hover:bg-[oklch(0.65_0.2_40/0.08)] hover:border-[oklch(0.65_0.2_40/0.8)] transition-smooth"
              data-ocid="dashboard.join_meeting_button"
            >
              {isJoining ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
                  Connecting...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" /> Join Now
                </>
              )}
            </Button>

            {/* Decorative amber terminal */}
            <div className="rounded-lg bg-[oklch(0.07_0_0)] border border-[oklch(0.2_0_0)] p-3 mt-1 font-mono text-xs space-y-0.5">
              {[
                "System.Log: Awaiting room code...",
                "System.Log: P2P handshake ready.",
                "System.Log: Firewall traversal OK.",
                "System.Log: Peers ready to sync...",
              ].map((line, i) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.12 }}
                  className="text-accent/60"
                >
                  <span className="text-accent/30 mr-1">›</span>
                  {line}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Meetings */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono font-semibold text-sm text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Recent Meetings
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs font-mono text-muted-foreground hover:text-primary transition-smooth"
              onClick={() => navigate({ to: "/history" })}
              data-ocid="dashboard.view_all_history_button"
            >
              View all <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          {historyLoading || isFetching ? (
            <HistorySkeleton />
          ) : recentHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-[oklch(0.55_0.15_142/0.3)] rounded-xl p-10 flex flex-col items-center gap-3 text-center bg-[oklch(0.55_0.15_142/0.03)]"
              data-ocid="dashboard.history_empty_state"
            >
              <div className="p-3 rounded-full bg-[oklch(0.55_0.15_142/0.1)] border border-[oklch(0.55_0.15_142/0.25)]">
                <Terminal className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-mono text-sm text-primary">
                  No sessions found.
                </p>
                <p className="font-mono text-xs text-muted-foreground mt-0.5">
                  Initialize first meeting.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={createMeeting}
                disabled={isCreating || !actor}
                className="font-mono mt-1 glow-emerald hover:glow-emerald-active transition-smooth"
                data-ocid="dashboard.empty_create_button"
              >
                <Plus className="w-4 h-4 mr-1" /> New Session
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-2" data-ocid="dashboard.history_list">
              {recentHistory.map((entry, idx) => (
                <motion.div
                  key={entry.roomCode}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + idx * 0.07 }}
                  className="bg-card border border-border rounded-lg px-4 py-3 flex items-center justify-between hover:border-primary/30 hover:bg-[oklch(0.55_0.15_142/0.04)] transition-smooth group"
                  data-ocid={`dashboard.history_item.${idx + 1}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Icon */}
                    <div className="p-1.5 rounded-md bg-muted/50 flex-shrink-0 group-hover:bg-[oklch(0.55_0.15_142/0.1)] transition-smooth">
                      <Video className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-smooth" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-sm text-foreground truncate">
                        {entry.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="code-label text-muted-foreground">
                          {entry.roomCode}
                        </span>
                        <span className="text-muted-foreground/30 text-xs">
                          ·
                        </span>
                        <span className="code-label text-muted-foreground">
                          {formatDate(entry.date)}
                        </span>
                        {entry.participantCount &&
                          Number(entry.participantCount) > 0 && (
                            <>
                              <span className="text-muted-foreground/30 text-xs">
                                ·
                              </span>
                              <span className="code-label text-muted-foreground flex items-center gap-1">
                                <Users className="w-2.5 h-2.5" />
                                {Number(entry.participantCount)}
                              </span>
                            </>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    {/* Duration */}
                    <span className="code-label text-muted-foreground hidden sm:block">
                      {formatDuration(entry.durationSeconds)}
                    </span>
                    {/* Role badge */}
                    {entry.role === Variant_host_participant.host ? (
                      <Badge
                        variant="outline"
                        className="code-label border-[oklch(0.55_0.15_142/0.5)] text-primary bg-[oklch(0.55_0.15_142/0.08)]"
                      >
                        Host
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="code-label border-[oklch(0.65_0.2_40/0.5)] text-accent bg-[oklch(0.65_0.2_40/0.08)]"
                      >
                        Guest
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
