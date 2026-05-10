import { o } from "./index-DuPiBNs4.js";
const createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const api = { setState, getState, getInitialState, subscribe };
  const initialState = state = createState(setState, getState, api);
  return api;
};
const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;
const identity = (arg) => arg;
function useStore(api, selector = identity) {
  const slice = o.useSyncExternalStore(
    api.subscribe,
    o.useCallback(() => selector(api.getState()), [api, selector]),
    o.useCallback(() => selector(api.getInitialState()), [api, selector])
  );
  o.useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  const api = createStore(createState);
  const useBoundStore = (selector) => useStore(api, selector);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
const create = (createState) => createState ? createImpl(createState) : createImpl;
const useMeetingStore = create((set) => ({
  currentUserId: null,
  currentRoomCode: null,
  isMuted: false,
  cameraOn: true,
  screenSharing: false,
  recordingActive: false,
  recordingDuration: 0,
  participants: [],
  setRoom: (roomCode, userId) => set({ currentRoomCode: roomCode, currentUserId: userId }),
  clearRoom: () => set({
    currentRoomCode: null,
    currentUserId: null,
    isMuted: false,
    cameraOn: true,
    screenSharing: false,
    recordingActive: false,
    recordingDuration: 0,
    participants: []
  }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  toggleCamera: () => set((s) => ({ cameraOn: !s.cameraOn })),
  toggleScreenShare: () => set((s) => ({ screenSharing: !s.screenSharing })),
  startRecording: () => set({ recordingActive: true, recordingDuration: 0 }),
  stopRecording: () => set({ recordingActive: false }),
  setParticipants: (participants) => set({ participants }),
  tickRecording: () => set((s) => ({
    recordingDuration: s.recordingActive ? s.recordingDuration + 1 : s.recordingDuration
  }))
}));
export {
  useMeetingStore as u
};
