import type { ParticipantInfo } from "@/backend";
import { create } from "zustand";

interface MeetingState {
  currentUserId: string | null;
  currentRoomCode: string | null;
  isMuted: boolean;
  cameraOn: boolean;
  screenSharing: boolean;
  recordingActive: boolean;
  recordingDuration: number;
  participants: ParticipantInfo[];

  setRoom: (roomCode: string, userId: string) => void;
  clearRoom: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  toggleScreenShare: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  setParticipants: (participants: ParticipantInfo[]) => void;
  tickRecording: () => void;
}

export const useMeetingStore = create<MeetingState>((set) => ({
  currentUserId: null,
  currentRoomCode: null,
  isMuted: false,
  cameraOn: true,
  screenSharing: false,
  recordingActive: false,
  recordingDuration: 0,
  participants: [],

  setRoom: (roomCode, userId) =>
    set({ currentRoomCode: roomCode, currentUserId: userId }),

  clearRoom: () =>
    set({
      currentRoomCode: null,
      currentUserId: null,
      isMuted: false,
      cameraOn: true,
      screenSharing: false,
      recordingActive: false,
      recordingDuration: 0,
      participants: [],
    }),

  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  toggleCamera: () => set((s) => ({ cameraOn: !s.cameraOn })),
  toggleScreenShare: () => set((s) => ({ screenSharing: !s.screenSharing })),

  startRecording: () => set({ recordingActive: true, recordingDuration: 0 }),
  stopRecording: () => set({ recordingActive: false }),

  setParticipants: (participants) => set({ participants }),
  tickRecording: () =>
    set((s) => ({
      recordingDuration: s.recordingActive
        ? s.recordingDuration + 1
        : s.recordingDuration,
    })),
}));
