// WebRTC signaling types for IntellMeet
import Common "common";
import Principal "mo:core/Principal";

module {
  public type SignalType = { #offer; #answer; #ice };

  public type Signal = {
    id : Nat;
    signalType : SignalType;
    fromUser : Principal;
    toUser : Principal;
    roomCode : Common.RoomCode;
    payload : Text; // JSON-encoded SDP or ICE candidate
    createdAt : Common.Timestamp;
    var consumed : Bool;
  };

  // Shared version — no var fields
  public type SignalInfo = {
    id : Nat;
    signalType : SignalType;
    fromUser : Text; // Principal as Text
    toUser : Text;   // Principal as Text
    roomCode : Common.RoomCode;
    payload : Text;
    createdAt : Common.Timestamp;
    consumed : Bool;
  };
};
