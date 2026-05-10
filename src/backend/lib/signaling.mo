// Domain logic for WebRTC signaling relay
import CommonTypes "../types/common";
import SignalTypes "../types/signaling";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Iter "mo:core/Iter";

module {
  /// Store a new signal (offer/answer/ICE) for a target participant
  public func storeSignal(
    signals : Map.Map<Nat, SignalTypes.Signal>,
    counter : Nat,
    signalType : SignalTypes.SignalType,
    fromUser : Principal,
    toUser : Principal,
    roomCode : CommonTypes.RoomCode,
    payload : Text,
  ) : Nat {
    let id = counter;
    let signal : SignalTypes.Signal = {
      id;
      signalType;
      fromUser;
      toUser;
      roomCode;
      payload;
      createdAt = Time.now();
      var consumed = false;
    };
    signals.add(id, signal);
    id
  };

  /// Retrieve all pending (unconsumed) signals for a target user in a room
  public func getPendingSignals(
    signals : Map.Map<Nat, SignalTypes.Signal>,
    toUser : Principal,
    roomCode : CommonTypes.RoomCode,
  ) : [SignalTypes.SignalInfo] {
    signals.entries()
      |> _.filter(func((_, s) : (Nat, SignalTypes.Signal)) : Bool {
          s.toUser.equal(toUser) and s.roomCode == roomCode and not s.consumed
        })
      |> _.map(func((_, s) : (Nat, SignalTypes.Signal)) : SignalTypes.SignalInfo {
          toSignalInfo(s)
        })
      |> _.toArray()
  };

  /// Mark signals as consumed
  public func consumeSignals(
    signals : Map.Map<Nat, SignalTypes.Signal>,
    ids : [Nat],
    caller : Principal,
  ) : Nat {
    var consumed = 0;
    for (id in ids.values()) {
      switch (signals.get(id)) {
        case (?s) {
          // Only the intended recipient can consume a signal
          if (s.toUser.equal(caller) and not s.consumed) {
            s.consumed := true;
            consumed += 1;
          };
        };
        case null {};
      };
    };
    consumed
  };

  /// Convert internal Signal to shared SignalInfo
  public func toSignalInfo(s : SignalTypes.Signal) : SignalTypes.SignalInfo {
    {
      id = s.id;
      signalType = s.signalType;
      fromUser = s.fromUser.toText();
      toUser = s.toUser.toText();
      roomCode = s.roomCode;
      payload = s.payload;
      createdAt = s.createdAt;
      consumed = s.consumed;
    }
  };
};
