import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useBackend } from "@/hooks/useBackend";
import { useRecording } from "@/hooks/useRecording";
import { useMeetingStore } from "@/store/meetingStore";
import type { ParticipantInfo, SignalInfo } from "@/types";
import { SignalType } from "@/types";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Camera,
  CameraOff,
  Check,
  ChevronRight,
  Circle,
  Copy,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  PenTool,
  PhoneOff,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ─── Video Tile ───────────────────────────────────────────────────────────────

interface VideoTileProps {
  stream: MediaStream | null;
  label: string;
  muted?: boolean;
  isLocal?: boolean;
  isMutedAudio?: boolean;
  cameraOff?: boolean;
  isScreenSharing?: boolean;
  ocid?: string;
}

function VideoTile({
  stream,
  label,
  muted = false,
  isLocal = false,
  isMutedAudio = false,
  cameraOff = false,
  isScreenSharing = false,
  ocid,
}: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const glowClass = isScreenSharing
    ? "border-emerald-glow-active"
    : "border border-border";

  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-card flex items-center justify-center transition-smooth ${glowClass}`}
      data-ocid={ocid}
      style={{ minHeight: "180px" }}
    >
      {stream && !cameraOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          className="w-full h-full object-cover"
        >
          <track kind="captions" />
        </video>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
            <span className="font-mono font-bold text-2xl text-primary">
              {label.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="code-label text-muted-foreground">{label}</span>
        </div>
      )}

      {/* Name overlay */}
      <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
        <span className="code-label bg-background/80 backdrop-blur-sm text-foreground px-2 py-0.5 rounded max-w-[70%] truncate">
          {label}
          {isLocal && <span className="ml-1 text-primary">&middot;you</span>}
        </span>
        <div className="flex items-center gap-1">
          {isMutedAudio && (
            <div className="bg-destructive/20 rounded-full p-0.5">
              <MicOff className="w-3 h-3 text-destructive" />
            </div>
          )}
          {cameraOff && (
            <div className="bg-muted/60 rounded-full p-0.5">
              <CameraOff className="w-3 h-3 text-muted-foreground" />
            </div>
          )}
          {isScreenSharing && (
            <div className="bg-primary/20 rounded-full p-0.5">
              <Monitor className="w-3 h-3 text-primary" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Participant row in sidebar ───────────────────────────────────────────────

function ParticipantRow({ p, idx }: { p: ParticipantInfo; idx: number }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/30 transition-smooth"
      data-ocid={`sidebar.participant.${idx + 1}`}
    >
      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
        <span className="code-label font-bold text-primary">
          {p.displayName.charAt(0).toUpperCase()}
        </span>
      </div>
      <span className="code-label text-foreground flex-1 truncate min-w-0">
        {p.displayName}
      </span>
      <div className="flex items-center gap-1 shrink-0">
        {p.isMuted ? (
          <MicOff className="w-3 h-3 text-destructive" />
        ) : (
          <Mic className="w-3 h-3 text-primary" />
        )}
        {p.cameraOn ? (
          <Camera className="w-3 h-3 text-primary" />
        ) : (
          <CameraOff className="w-3 h-3 text-muted-foreground" />
        )}
        {p.screenSharing && <Monitor className="w-3 h-3 text-accent" />}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface PeerConn {
  pc: RTCPeerConnection;
  stream: MediaStream;
  userId: string;
  displayName: string;
}

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

export function MeetingRoomPage() {
  useAuthGuard({ requireAuth: true });
  const { roomCode } = useParams({ from: "/meeting/$roomCode" });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { identity } = useInternetIdentity();
  const qc = useQueryClient();
  const myUserId = identity?.getPrincipal().toText() ?? "";

  // ─── Zustand store ───────────────────────────────────────────────────────
  const {
    isMuted,
    cameraOn,
    screenSharing,
    recordingActive,
    recordingDuration,
    toggleMute,
    toggleCamera,
    toggleScreenShare,
    startRecording: storeStartRecording,
    stopRecording: storeStopRecording,
    clearRoom,
    tickRecording,
    setParticipants,
  } = useMeetingStore();

  // ─── Local media refs ────────────────────────────────────────────────────
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  // ─── Peer connections ────────────────────────────────────────────────────
  const peersRef = useRef<Map<string, PeerConn>>(new Map());
  const [peerStreams, setPeerStreams] = useState<PeerConn[]>([]);
  const processedSignalIds = useRef<Set<bigint>>(new Set());

  // ─── UI state ────────────────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const recTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Recording hook ──────────────────────────────────────────────────────
  const { startRecording: recStart, stopRecording: recStop } = useRecording({
    onSave: async (url, durationSeconds) => {
      if (!actor) return;
      try {
        await actor.saveRecording(
          roomCode,
          BigInt(durationSeconds),
          url,
          BigInt(peersRef.current.size + 1),
        );
        qc.invalidateQueries({ queryKey: ["recordings"] });
        toast.success("Recording saved to history");
      } catch {
        toast.error("Could not save recording metadata");
      }
    },
  });

  // ─── Helper: sync peer streams state ────────────────────────────────────
  const syncPeerStreams = useCallback(() => {
    setPeerStreams(Array.from(peersRef.current.values()));
  }, []);

  // ─── Helper: create RTCPeerConnection ───────────────────────────────────
  const createPeerConnection = useCallback(
    (targetUserId: string, displayName: string): RTCPeerConnection => {
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

      if (localStreamRef.current) {
        for (const track of localStreamRef.current.getTracks()) {
          pc.addTrack(track, localStreamRef.current);
        }
      }

      const remoteStream = new MediaStream();
      peersRef.current.set(targetUserId, {
        pc,
        stream: remoteStream,
        userId: targetUserId,
        displayName,
      });
      syncPeerStreams();

      pc.ontrack = (evt) => {
        for (const track of evt.streams[0]?.getTracks() ?? []) {
          remoteStream.addTrack(track);
        }
        syncPeerStreams();
      };

      pc.onicecandidate = async (evt) => {
        if (!evt.candidate || !actor) return;
        try {
          const principal = identity?.getPrincipal();
          if (!principal) return;
          await actor.sendIce(
            principal,
            roomCode,
            JSON.stringify({ target: targetUserId, candidate: evt.candidate }),
          );
        } catch {}
      };

      pc.onconnectionstatechange = () => {
        if (
          pc.connectionState === "disconnected" ||
          pc.connectionState === "failed" ||
          pc.connectionState === "closed"
        ) {
          peersRef.current.delete(targetUserId);
          syncPeerStreams();
        }
      };

      return pc;
    },
    [actor, identity, roomCode, syncPeerStreams],
  );

  // ─── Process incoming signals ────────────────────────────────────────────
  const processSignals = useCallback(
    async (signals: SignalInfo[]) => {
      if (!actor) return;
      const toConsume: bigint[] = [];

      for (const sig of signals) {
        if (processedSignalIds.current.has(sig.id)) continue;
        if (sig.toUser !== myUserId) continue;
        processedSignalIds.current.add(sig.id);
        toConsume.push(sig.id);

        const fromUser = sig.fromUser;

        if (sig.signalType === SignalType.offer) {
          if (!peersRef.current.has(fromUser)) {
            createPeerConnection(fromUser, fromUser.slice(0, 8));
          }
          const peerEntry = peersRef.current.get(fromUser);
          if (!peerEntry) continue;
          try {
            const offerSdp = JSON.parse(
              sig.payload,
            ) as RTCSessionDescriptionInit;
            await peerEntry.pc.setRemoteDescription(
              new RTCSessionDescription(offerSdp),
            );
            const answer = await peerEntry.pc.createAnswer();
            await peerEntry.pc.setLocalDescription(answer);
            const principal = identity?.getPrincipal();
            if (principal) {
              await actor.sendAnswer(
                principal,
                roomCode,
                JSON.stringify(answer),
              );
            }
          } catch {}
        } else if (sig.signalType === SignalType.answer) {
          const peerEntry = peersRef.current.get(fromUser);
          if (!peerEntry) continue;
          try {
            const answerSdp = JSON.parse(
              sig.payload,
            ) as RTCSessionDescriptionInit;
            if (peerEntry.pc.signalingState !== "stable") {
              await peerEntry.pc.setRemoteDescription(
                new RTCSessionDescription(answerSdp),
              );
            }
          } catch {}
        } else if (sig.signalType === SignalType.ice) {
          const parsed = JSON.parse(sig.payload) as {
            target: string;
            candidate: RTCIceCandidateInit;
          };
          const peerEntry = peersRef.current.get(fromUser);
          if (!peerEntry) continue;
          try {
            await peerEntry.pc.addIceCandidate(
              new RTCIceCandidate(parsed.candidate),
            );
          } catch {}
        }
      }

      if (toConsume.length > 0) {
        actor.consumeSignals(toConsume).catch(() => {});
      }
    },
    [actor, identity, myUserId, roomCode, createPeerConnection],
  );

  // ─── Initiate offer to new participant ──────────────────────────────────
  const initiateOffer = useCallback(
    async (targetUserId: string, displayName: string) => {
      if (!actor || !identity) return;
      if (peersRef.current.has(targetUserId)) return;

      const pc = createPeerConnection(targetUserId, displayName);
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        const principal = identity.getPrincipal();
        await actor.sendOffer(principal, roomCode, JSON.stringify(offer));
      } catch {}
    },
    [actor, identity, roomCode, createPeerConnection],
  );

  // ─── Participants polling ────────────────────────────────────────────────
  const { data: participants = [] } = useQuery<ParticipantInfo[]>({
    queryKey: ["participants", roomCode],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listParticipants(roomCode);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 2000,
  });

  const knownPeers = useRef<Set<string>>(new Set());
  useEffect(() => {
    const active = participants.filter((p) => p.isActive);
    setParticipants(active);
    for (const p of active) {
      if (p.userId !== myUserId && !knownPeers.current.has(p.userId)) {
        knownPeers.current.add(p.userId);
        initiateOffer(p.userId, p.displayName);
      }
    }
  }, [participants, myUserId, setParticipants, initiateOffer]);

  // ─── Signal polling ──────────────────────────────────────────────────────
  useQuery<SignalInfo[]>({
    queryKey: ["signals", roomCode],
    queryFn: async () => {
      if (!actor) return [];
      const sigs = await actor.getPendingSignals(roomCode);
      await processSignals(sigs);
      return sigs;
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 2000,
  });

  // ─── Join room + start local media ──────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (!mounted) {
          for (const t of stream.getTracks()) t.stop();
          return;
        }
        localStreamRef.current = stream;
        setLocalStream(stream);
      } catch {
        toast.error("Could not access camera or microphone");
      }

      try {
        const displayName = myUserId.slice(0, 12);
        await actor?.joinRoom(roomCode, displayName);
        qc.invalidateQueries({ queryKey: ["participants", roomCode] });
      } catch {
        toast.error("Failed to join room");
      }
    };

    if (actor && !isFetching) {
      init();
    }

    return () => {
      mounted = false;
    };
  }, [actor, isFetching, myUserId, qc, roomCode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        for (const t of localStreamRef.current.getTracks()) t.stop();
      }
      if (screenStreamRef.current) {
        for (const t of screenStreamRef.current.getTracks()) t.stop();
      }
      for (const peer of peersRef.current.values()) {
        peer.pc.close();
      }
      peersRef.current.clear();
    };
  }, []);

  // ─── Mute / camera sync to tracks & backend ─────────────────────────────
  useEffect(() => {
    if (localStreamRef.current) {
      for (const t of localStreamRef.current.getAudioTracks()) {
        t.enabled = !isMuted;
      }
    }
    if (actor && !isFetching) {
      actor.updateMyState(roomCode, isMuted, null, null).catch(() => {});
    }
  }, [isMuted, actor, roomCode, isFetching]);

  useEffect(() => {
    if (localStreamRef.current) {
      for (const t of localStreamRef.current.getVideoTracks()) {
        t.enabled = cameraOn;
      }
    }
    if (actor && !isFetching) {
      actor.updateMyState(roomCode, null, cameraOn, null).catch(() => {});
    }
  }, [cameraOn, actor, roomCode, isFetching]);

  // ─── Screen share ────────────────────────────────────────────────────────
  const handleScreenShare = useCallback(async () => {
    if (!screenSharing) {
      try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        screenStreamRef.current = displayStream;
        for (const peer of peersRef.current.values()) {
          const vSender = peer.pc
            .getSenders()
            .find((s) => s.track?.kind === "video");
          const vTrack = displayStream.getVideoTracks()[0];
          if (vSender && vTrack) {
            vSender.replaceTrack(vTrack).catch(() => {});
          }
        }
        displayStream.getVideoTracks()[0]?.addEventListener("ended", () => {
          screenStreamRef.current = null;
          toggleScreenShare();
          actor?.updateMyState(roomCode, null, null, false).catch(() => {});
        });
        toggleScreenShare();
        actor?.updateMyState(roomCode, null, null, true).catch(() => {});
        toast.success("Screen sharing started");
      } catch {
        toast.error("Screen sharing cancelled or unavailable");
      }
    } else {
      if (screenStreamRef.current) {
        for (const t of screenStreamRef.current.getTracks()) t.stop();
        screenStreamRef.current = null;
      }
      if (localStreamRef.current) {
        for (const peer of peersRef.current.values()) {
          const vSender = peer.pc
            .getSenders()
            .find((s) => s.track?.kind === "video");
          const vTrack = localStreamRef.current.getVideoTracks()[0];
          if (vSender && vTrack) {
            vSender.replaceTrack(vTrack).catch(() => {});
          }
        }
      }
      toggleScreenShare();
      actor?.updateMyState(roomCode, null, null, false).catch(() => {});
      toast.info("Screen sharing stopped");
    }
  }, [screenSharing, toggleScreenShare, actor, roomCode]);

  // ─── Recording controls ──────────────────────────────────────────────────
  useEffect(() => {
    if (recordingActive) {
      recTimerRef.current = setInterval(tickRecording, 1000);
    } else {
      if (recTimerRef.current) clearInterval(recTimerRef.current);
    }
    return () => {
      if (recTimerRef.current) clearInterval(recTimerRef.current);
    };
  }, [recordingActive, tickRecording]);

  const handleStartRecording = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    recStart(stream);
    storeStartRecording();
    toast.success("Recording started");
  }, [recStart, storeStartRecording]);

  const handleStopRecording = useCallback(() => {
    recStop();
    storeStopRecording();
  }, [recStop, storeStopRecording]);

  // ─── Leave meeting ───────────────────────────────────────────────────────
  const handleLeave = useCallback(async () => {
    if (recordingActive) handleStopRecording();
    if (actor) {
      try {
        await actor.leaveRoom(roomCode);
      } catch {}
    }
    for (const peer of peersRef.current.values()) peer.pc.close();
    peersRef.current.clear();
    setPeerStreams([]);
    if (localStreamRef.current) {
      for (const t of localStreamRef.current.getTracks()) t.stop();
    }
    if (screenStreamRef.current) {
      for (const t of screenStreamRef.current.getTracks()) t.stop();
    }
    clearRoom();
    qc.invalidateQueries({ queryKey: ["meetingHistory"] });
    navigate({ to: "/dashboard" });
  }, [
    recordingActive,
    handleStopRecording,
    actor,
    roomCode,
    clearRoom,
    qc,
    navigate,
  ]);

  // ─── Copy room code ──────────────────────────────────────────────────────
  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(roomCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [roomCode]);

  // ─── Derived state ───────────────────────────────────────────────────────
  const activeParticipants = participants.filter((p) => p.isActive);
  const remoteParticipants = activeParticipants.filter(
    (p) => p.userId !== myUserId,
  );
  const totalTiles = 1 + peerStreams.length;
  const gridCols =
    totalTiles === 1
      ? "grid-cols-1"
      : totalTiles <= 2
        ? "grid-cols-2"
        : totalTiles <= 4
          ? "grid-cols-2"
          : "grid-cols-3";

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col h-screen bg-background grid-pattern overflow-hidden"
      data-ocid="meeting.page"
    >
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-4 h-14 bg-card border-b border-primary/20 shrink-0 z-20"
        style={{ boxShadow: "0 0 12px 0 oklch(0.55 0.15 142 / 0.15)" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono font-bold text-primary text-base tracking-tight">
            IntellMeet
          </span>
          <span className="text-muted-foreground">/</span>
          <div
            className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-lg border border-border"
            data-ocid="meeting.room_code"
          >
            <span className="code-label text-foreground font-bold tracking-widest">
              {roomCode}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="text-muted-foreground hover:text-primary transition-smooth"
              aria-label="Copy room code"
              data-ocid="meeting.copy_code_button"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-primary" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {recordingActive && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full animate-pulse"
              style={{
                background: "oklch(0.6 0.2 25 / 0.15)",
                border: "1px solid oklch(0.6 0.2 25 / 0.5)",
              }}
              data-ocid="meeting.recording_indicator"
            >
              <Circle
                className="w-2 h-2 fill-current"
                style={{ color: "oklch(0.6 0.2 25)" }}
              />
              <span
                className="code-label font-bold"
                style={{ color: "oklch(0.6 0.2 25)" }}
              >
                REC {formatDuration(recordingDuration)}
              </span>
            </div>
          )}

          <Badge
            variant="outline"
            className="code-label border-primary/30 text-primary"
            data-ocid="meeting.participant_count"
          >
            <Users className="w-3 h-3 mr-1" />
            {activeParticipants.length}
          </Badge>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen((v) => !v)}
            className="code-label border-border"
            aria-label="Toggle participant list"
            data-ocid="meeting.sidebar_toggle"
          >
            <Users className="w-3.5 h-3.5 mr-1" />
            Participants
            <ChevronRight
              className={`w-3.5 h-3.5 ml-1 transition-smooth ${
                sidebarOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </Button>
        </div>
      </header>

      {/* ── Content area ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Video grid ─────────────────────────────────────────────────── */}
        <div
          className={`flex-1 p-3 grid ${gridCols} gap-3 content-start overflow-auto`}
          data-ocid="meeting.video_grid"
        >
          <VideoTile
            stream={localStream}
            label={myUserId.slice(0, 12)}
            muted
            isLocal
            isMutedAudio={isMuted}
            cameraOff={!cameraOn}
            isScreenSharing={screenSharing}
            ocid="meeting.local_video"
          />

          {peerStreams.map((peer, idx) => {
            const pInfo = activeParticipants.find(
              (p) => p.userId === peer.userId,
            );
            return (
              <VideoTile
                key={peer.userId}
                stream={peer.stream}
                label={pInfo?.displayName ?? peer.displayName}
                isMutedAudio={pInfo?.isMuted ?? false}
                cameraOff={!(pInfo?.cameraOn ?? true)}
                isScreenSharing={pInfo?.screenSharing ?? false}
                ocid={`meeting.remote_video.${idx + 1}`}
              />
            );
          })}

          {remoteParticipants
            .filter((p) => !peersRef.current.has(p.userId))
            .map((p, idx) => (
              <VideoTile
                key={p.userId}
                stream={null}
                label={p.displayName}
                isMutedAudio={p.isMuted}
                cameraOff={!p.cameraOn}
                isScreenSharing={p.screenSharing}
                ocid={`meeting.participant_tile.${idx + 1}`}
              />
            ))}
        </div>

        {/* ── Participant sidebar ─────────────────────────────────────────── */}
        {sidebarOpen && (
          <aside
            className="w-64 shrink-0 border-l border-border bg-card flex flex-col"
            data-ocid="meeting.sidebar"
          >
            <div className="px-3 py-3 border-b border-border flex items-center justify-between">
              <span className="code-label text-muted-foreground uppercase tracking-widest">
                Participants
              </span>
              <Badge
                variant="outline"
                className="code-label border-primary/30 text-primary"
              >
                {activeParticipants.length}
              </Badge>
            </div>
            <ScrollArea className="flex-1">
              <div className="py-2">
                {activeParticipants.length === 0 ? (
                  <div
                    className="px-3 py-6 text-center"
                    data-ocid="sidebar.empty_state"
                  >
                    <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="code-label text-muted-foreground">
                      No participants yet
                    </p>
                  </div>
                ) : (
                  activeParticipants.map((p, idx) => (
                    <ParticipantRow key={p.userId} p={p} idx={idx} />
                  ))
                )}
              </div>
            </ScrollArea>
          </aside>
        )}
      </div>

      {/* ── Controls toolbar ─────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-center gap-2 px-4 py-3 bg-card border-t border-primary/20 shrink-0 z-20"
        style={{ boxShadow: "0 -4px 16px 0 oklch(0.55 0.15 142 / 0.08)" }}
        data-ocid="meeting.controls_bar"
      >
        <Button
          type="button"
          variant={isMuted ? "destructive" : "outline"}
          size="icon"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
          className="transition-smooth"
          data-ocid="meeting.mute_toggle"
          style={
            !isMuted ? { borderColor: "oklch(0.55 0.15 142 / 0.5)" } : undefined
          }
        >
          {isMuted ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4 text-primary" />
          )}
        </Button>

        <Button
          type="button"
          variant={cameraOn ? "outline" : "destructive"}
          size="icon"
          onClick={toggleCamera}
          aria-label={cameraOn ? "Turn off camera" : "Turn on camera"}
          className="transition-smooth"
          data-ocid="meeting.camera_toggle"
          style={
            cameraOn ? { borderColor: "oklch(0.55 0.15 142 / 0.5)" } : undefined
          }
        >
          {cameraOn ? (
            <Camera className="w-4 h-4 text-primary" />
          ) : (
            <CameraOff className="w-4 h-4" />
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleScreenShare}
          aria-label={screenSharing ? "Stop screen share" : "Share screen"}
          className="transition-smooth"
          data-ocid="meeting.screenshare_toggle"
          style={
            screenSharing
              ? {
                  background: "oklch(0.55 0.15 142 / 0.2)",
                  borderColor: "oklch(0.55 0.15 142)",
                  color: "oklch(0.55 0.15 142)",
                }
              : undefined
          }
        >
          {screenSharing ? (
            <MonitorOff className="w-4 h-4" />
          ) : (
            <Monitor className="w-4 h-4" />
          )}
        </Button>

        {recordingActive ? (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleStopRecording}
            aria-label="Stop recording"
            className="animate-pulse"
            data-ocid="meeting.stop_recording_button"
          >
            <Circle className="w-4 h-4 fill-current" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleStartRecording}
            aria-label="Start recording"
            className="transition-smooth"
            data-ocid="meeting.start_recording_button"
          >
            <Circle
              className="w-4 h-4"
              style={{ color: "oklch(0.6 0.2 25)" }}
            />
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() =>
            navigate({ to: "/whiteboard/$roomCode", params: { roomCode } })
          }
          aria-label="Open whiteboard"
          className="transition-smooth"
          data-ocid="meeting.whiteboard_button"
        >
          <PenTool className="w-4 h-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        <Button
          type="button"
          size="sm"
          onClick={handleLeave}
          aria-label="Leave meeting"
          className="transition-smooth font-mono text-xs gap-1.5"
          style={{
            background: "oklch(0.6 0.2 25 / 0.15)",
            borderColor: "oklch(0.6 0.2 25 / 0.6)",
            color: "oklch(0.7 0.18 25)",
          }}
          data-ocid="meeting.leave_button"
        >
          <PhoneOff className="w-4 h-4" />
          Leave
        </Button>
      </div>
    </div>
  );
}
