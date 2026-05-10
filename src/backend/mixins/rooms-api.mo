// Public API mixin for meeting rooms and participant management
import CommonTypes "../types/common";
import RoomTypes "../types/rooms";
import Map "mo:core/Map";
import List "mo:core/List";
import RoomsLib "../lib/rooms";

mixin (
  rooms : Map.Map<CommonTypes.RoomCode, RoomTypes.Room>,
  participants : Map.Map<CommonTypes.RoomCode, List.List<RoomTypes.ParticipantState>>,
  state : { var roomCounter : Nat },
) {
  // --- Room endpoints ---

  /// Create a new meeting room; returns the unique 6-char room code
  public shared ({ caller }) func createRoom(title : Text) : async CommonTypes.RoomCode {
    state.roomCounter += 1;
    RoomsLib.createRoom(rooms, title, caller, state.roomCounter)
  };

  /// Get room information by code
  public shared query func getRoomInfo(code : CommonTypes.RoomCode) : async ?RoomTypes.RoomInfo {
    RoomsLib.getRoom(rooms, code)
  };

  /// Close a room (only the creator can close it)
  public shared ({ caller }) func closeRoom(code : CommonTypes.RoomCode) : async Bool {
    RoomsLib.closeRoom(rooms, code, caller)
  };

  // --- Participant endpoints ---

  /// Join a room as a participant
  public shared ({ caller }) func joinRoom(
    roomCode : CommonTypes.RoomCode,
    displayName : Text,
  ) : async Bool {
    RoomsLib.joinParticipant(participants, rooms, roomCode, caller, displayName)
  };

  /// Update your AV state (null = keep current value)
  public shared ({ caller }) func updateMyState(
    roomCode : CommonTypes.RoomCode,
    isMuted : ?Bool,
    cameraOn : ?Bool,
    screenSharing : ?Bool,
  ) : async Bool {
    RoomsLib.updateParticipantState(participants, roomCode, caller, isMuted, cameraOn, screenSharing)
  };

  /// Leave a room
  public shared ({ caller }) func leaveRoom(roomCode : CommonTypes.RoomCode) : async Bool {
    RoomsLib.leaveParticipant(participants, rooms, roomCode, caller)
  };

  /// List active participants in a room
  public shared query func listParticipants(
    roomCode : CommonTypes.RoomCode,
  ) : async [RoomTypes.ParticipantInfo] {
    RoomsLib.listParticipants(participants, roomCode)
  };
};
