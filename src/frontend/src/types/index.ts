// Re-export backend types for use across the frontend
export type {
  SignalInfo,
  RecordingInfo,
  MeetingHistoryEntry,
  StrokeInfo,
  ParticipantInfo,
  RoomInfo,
  RoomCode,
  Timestamp,
  DurationSeconds,
  Url,
} from "@/backend";

export { RoomStatus, SignalType, Variant_host_participant } from "@/backend";

// UI-specific types
export interface NavLink {
  label: string;
  to: string;
}

export interface MeetingStoreState {
  currentUserId: string | null;
  currentRoomCode: string | null;
  isMuted: boolean;
  cameraOn: boolean;
  screenSharing: boolean;
  recordingActive: boolean;
  recordingDuration: number;
  participants: import("@/backend").ParticipantInfo[];
}

export interface MeetingStoreActions {
  setRoom: (roomCode: string, userId: string) => void;
  clearRoom: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  toggleScreenShare: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  setParticipants: (
    participants: import("@/backend").ParticipantInfo[],
  ) => void;
  tickRecording: () => void;
}
