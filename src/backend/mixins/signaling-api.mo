// Public API mixin for WebRTC signaling relay
import CommonTypes "../types/common";
import SignalTypes "../types/signaling";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import SignalingLib "../lib/signaling";

mixin (
  signals : Map.Map<Nat, SignalTypes.Signal>,
  state : { var signalCounter : Nat },
) {
  /// Send a WebRTC offer to a target participant
  public shared ({ caller }) func sendOffer(
    toUser : Principal,
    roomCode : CommonTypes.RoomCode,
    payload : Text,
  ) : async Nat {
    state.signalCounter += 1;
    SignalingLib.storeSignal(signals, state.signalCounter, #offer, caller, toUser, roomCode, payload)
  };

  /// Send a WebRTC answer to a target participant
  public shared ({ caller }) func sendAnswer(
    toUser : Principal,
    roomCode : CommonTypes.RoomCode,
    payload : Text,
  ) : async Nat {
    state.signalCounter += 1;
    SignalingLib.storeSignal(signals, state.signalCounter, #answer, caller, toUser, roomCode, payload)
  };

  /// Send ICE candidates to a target participant
  public shared ({ caller }) func sendIce(
    toUser : Principal,
    roomCode : CommonTypes.RoomCode,
    payload : Text,
  ) : async Nat {
    state.signalCounter += 1;
    SignalingLib.storeSignal(signals, state.signalCounter, #ice, caller, toUser, roomCode, payload)
  };

  /// Retrieve all pending signals addressed to the caller in a room
  public shared ({ caller }) func getPendingSignals(
    roomCode : CommonTypes.RoomCode,
  ) : async [SignalTypes.SignalInfo] {
    SignalingLib.getPendingSignals(signals, caller, roomCode)
  };

  /// Mark a list of signal IDs as consumed
  public shared ({ caller }) func consumeSignals(ids : [Nat]) : async Nat {
    SignalingLib.consumeSignals(signals, ids, caller)
  };
};
