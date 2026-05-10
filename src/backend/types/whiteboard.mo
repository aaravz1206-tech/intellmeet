// Whiteboard stroke types for IntellMeet
import Common "common";
import Principal "mo:core/Principal";

module {
  public type Stroke = {
    id : Nat;
    roomCode : Common.RoomCode;
    userId : Principal;
    color : Text;
    width : Nat;
    path : Text; // JSON-encoded path array
    createdAt : Common.Timestamp;
  };

  // Shared version (userId as Text)
  public type StrokeInfo = {
    id : Nat;
    roomCode : Common.RoomCode;
    userId : Text; // Principal as Text
    color : Text;
    width : Nat;
    path : Text;
    createdAt : Common.Timestamp;
  };
};
