// Domain logic for meeting rooms and participants
import CommonTypes "../types/common";
import RoomTypes "../types/rooms";
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Text "mo:core/Text";

module {
  // --- Room Management ---

  /// Generate a unique 6-character alphanumeric room code
  public func generateCode(counter : Nat) : CommonTypes.RoomCode {
    // Base-36 encode the counter mod 36^6 into a 6-character alphanumeric code
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let base : Nat = 36;
    let digits : Nat = 6;
    var n = counter % (base * base * base * base * base * base);
    let arr = Array.tabulate(digits, func(i) {
      let _ = i;
      '0'
    });
    let buf = arr.toVarArray();
    var idx = digits;
    label fillLoop loop {
      if (idx == 0) break fillLoop;
      idx -= 1;
      let rem = n % base;
      buf[idx] := chars.toArray()[rem];
      n := n / base;
    };
    Array.tabulate(digits, func i = buf[i])
    |> Text.fromArray(_)
  };

  /// Create a new room and return its code
  public func createRoom(
    rooms : Map.Map<CommonTypes.RoomCode, RoomTypes.Room>,
    title : Text,
    creator : Principal,
    counter : Nat,
  ) : CommonTypes.RoomCode {
    let code = generateCode(counter);
    let room : RoomTypes.Room = {
      code;
      title;
      createdBy = creator;
      createdAt = Time.now();
      var closedAt = null;
      var status = #active;
      var participantCount = 0;
    };
    rooms.add(code, room);
    code
  };

  /// Get room info for a given code
  public func getRoom(
    rooms : Map.Map<CommonTypes.RoomCode, RoomTypes.Room>,
    code : CommonTypes.RoomCode,
  ) : ?RoomTypes.RoomInfo {
    switch (rooms.get(code)) {
      case (?room) ?toRoomInfo(room);
      case null null;
    }
  };

  /// Close a room (only by creator)
  public func closeRoom(
    rooms : Map.Map<CommonTypes.RoomCode, RoomTypes.Room>,
    code : CommonTypes.RoomCode,
    caller : Principal,
  ) : Bool {
    switch (rooms.get(code)) {
      case (?room) {
        if (not room.createdBy.equal(caller)) return false;
        room.status := #closed;
        room.closedAt := ?Time.now();
        true
      };
      case null false;
    }
  };

  /// Convert internal Room to shared RoomInfo
  public func toRoomInfo(room : RoomTypes.Room) : RoomTypes.RoomInfo {
    {
      code = room.code;
      title = room.title;
      createdBy = room.createdBy.toText();
      createdAt = room.createdAt;
      closedAt = room.closedAt;
      status = room.status;
      participantCount = room.participantCount;
    }
  };

  // --- Participant Management ---

  /// Add a participant to a room
  public func joinParticipant(
    participants : Map.Map<CommonTypes.RoomCode, List.List<RoomTypes.ParticipantState>>,
    rooms : Map.Map<CommonTypes.RoomCode, RoomTypes.Room>,
    roomCode : CommonTypes.RoomCode,
    user : Principal,
    displayName : Text,
  ) : Bool {
    // Room must exist and be active
    let room = switch (rooms.get(roomCode)) {
      case (?r) r;
      case null return false;
    };
    if (room.status != #active) return false;

    // Get or create participant list for this room
    let list = switch (participants.get(roomCode)) {
      case (?l) l;
      case null {
        let l = List.empty<RoomTypes.ParticipantState>();
        participants.add(roomCode, l);
        l
      };
    };

    // If already an active participant, return false
    let existing = list.find(func(p : RoomTypes.ParticipantState) : Bool {
      p.userId.equal(user) and p.isActive
    });
    switch (existing) { case (?_) return false; case null {} };

    let ps : RoomTypes.ParticipantState = {
      userId = user;
      roomCode;
      displayName;
      var isMuted = false;
      var cameraOn = true;
      var screenSharing = false;
      var isActive = true;
      joinedAt = Time.now();
      var leftAt = null;
    };
    list.add(ps);
    room.participantCount += 1;
    true
  };

  /// Update participant AV state (mute/camera/screen)
  public func updateParticipantState(
    participants : Map.Map<CommonTypes.RoomCode, List.List<RoomTypes.ParticipantState>>,
    roomCode : CommonTypes.RoomCode,
    user : Principal,
    isMuted : ?Bool,
    cameraOn : ?Bool,
    screenSharing : ?Bool,
  ) : Bool {
    let list = switch (participants.get(roomCode)) {
      case (?l) l;
      case null return false;
    };
    let p = list.find(func(ps : RoomTypes.ParticipantState) : Bool {
      ps.userId.equal(user) and ps.isActive
    });
    switch (p) {
      case (?ps) {
        switch (isMuted) { case (?v) ps.isMuted := v; case null {} };
        switch (cameraOn) { case (?v) ps.cameraOn := v; case null {} };
        switch (screenSharing) { case (?v) ps.screenSharing := v; case null {} };
        true
      };
      case null false;
    }
  };

  /// Mark participant as left (set isActive = false, record leftAt)
  public func leaveParticipant(
    participants : Map.Map<CommonTypes.RoomCode, List.List<RoomTypes.ParticipantState>>,
    rooms : Map.Map<CommonTypes.RoomCode, RoomTypes.Room>,
    roomCode : CommonTypes.RoomCode,
    user : Principal,
  ) : Bool {
    let list = switch (participants.get(roomCode)) {
      case (?l) l;
      case null return false;
    };
    let p = list.find(func(ps : RoomTypes.ParticipantState) : Bool {
      ps.userId.equal(user) and ps.isActive
    });
    switch (p) {
      case (?ps) {
        ps.isActive := false;
        ps.leftAt := ?Time.now();
        // Decrement room participant count
        switch (rooms.get(roomCode)) {
          case (?room) {
            if (room.participantCount > 0) room.participantCount -= 1;
          };
          case null {};
        };
        true
      };
      case null false;
    }
  };

  /// List all active participants in a room
  public func listParticipants(
    participants : Map.Map<CommonTypes.RoomCode, List.List<RoomTypes.ParticipantState>>,
    roomCode : CommonTypes.RoomCode,
  ) : [RoomTypes.ParticipantInfo] {
    let list = switch (participants.get(roomCode)) {
      case (?l) l;
      case null return [];
    };
    list.filter(func(p : RoomTypes.ParticipantState) : Bool { p.isActive })
        .map<RoomTypes.ParticipantState, RoomTypes.ParticipantInfo>(func(p) { toParticipantInfo(p) })
        .toArray()
  };

  /// Convert internal ParticipantState to shared ParticipantInfo
  public func toParticipantInfo(p : RoomTypes.ParticipantState) : RoomTypes.ParticipantInfo {
    {
      userId = p.userId.toText();
      roomCode = p.roomCode;
      displayName = p.displayName;
      isMuted = p.isMuted;
      cameraOn = p.cameraOn;
      screenSharing = p.screenSharing;
      isActive = p.isActive;
      joinedAt = p.joinedAt;
      leftAt = p.leftAt;
    }
  };
};
