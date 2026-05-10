// IntellMeet — composition root
// Wires all stable state and includes domain mixins.
// NO public methods here — all delegation is via mixins.
import Map "mo:core/Map";
import List "mo:core/List";
import RoomTypes "types/rooms";
import SignalTypes "types/signaling";
import WhiteboardTypes "types/whiteboard";
import RecordingTypes "types/recordings";
import CommonTypes "types/common";
import RoomsApi "mixins/rooms-api";
import SignalingApi "mixins/signaling-api";
import WhiteboardApi "mixins/whiteboard-api";
import RecordingsApi "mixins/recordings-api";

actor {
  // --- Shared counters (wrapped for mixin mutation by reference) ---
  let state = {
    var roomCounter : Nat = 0;
    var signalCounter : Nat = 0;
    var strokeCounter : Nat = 0;
    var recordingCounter : Nat = 0;
  };

  // --- Stable domain state ---
  let rooms = Map.empty<CommonTypes.RoomCode, RoomTypes.Room>();
  let participants = Map.empty<CommonTypes.RoomCode, List.List<RoomTypes.ParticipantState>>();
  let signals = Map.empty<Nat, SignalTypes.Signal>();
  let strokes = Map.empty<CommonTypes.RoomCode, List.List<WhiteboardTypes.Stroke>>();
  let recordings = List.empty<RecordingTypes.Recording>();

  // --- Domain mixins ---
  include RoomsApi(rooms, participants, state);
  include SignalingApi(signals, state);
  include WhiteboardApi(strokes, state);
  include RecordingsApi(recordings, rooms, participants, state);
};
