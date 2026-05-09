import { create } from 'zustand';

interface Message {
  sender: string;
  text: string;
}

interface MeetingState {
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  isSidebarOpen: boolean;
  activeView: 'video' | 'whiteboard';
  aiEnabled: boolean;
  messages: Message[];
  
  // Actions
  toggleMute: () => void;
  toggleVideo: () => void;
  setScreenSharing: (status: boolean) => void;
  toggleSidebar: () => void;
  setActiveView: (view: 'video' | 'whiteboard') => void;
  toggleAi: () => void;
  addMessage: (msg: Message) => void;
  resetState: () => void;
}

const useMeetingStore = create<MeetingState>((set) => ({
  isMuted: false,
  isVideoOff: false,
  isScreenSharing: false,
  isSidebarOpen: false,
  activeView: 'video',
  aiEnabled: false,
  messages: [],

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  toggleVideo: () => set((state) => ({ isVideoOff: !state.isVideoOff })),
  setScreenSharing: (status) => set({ isScreenSharing: status }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setActiveView: (view) => set({ activeView: view }),
  toggleAi: () => set((state) => ({ aiEnabled: !state.aiEnabled })),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  resetState: () => set({
    isMuted: false,
    isVideoOff: false,
    isScreenSharing: false,
    isSidebarOpen: false,
    activeView: 'video',
    aiEnabled: false,
    messages: []
  })
}));

export default useMeetingStore;
