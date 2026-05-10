// Room and participant domain types for IntellMeet
import Common "common";
import Principal "mo:core/Principal";

module {
  public type RoomStatus = { #active; #closed };

  public type Room = {
    code : Common.RoomCode;
    title : Text;
    createdBy : Principal;
    createdAt : Common.Timestamp;
    var closedAt : ?Common.Timestamp;
    var status : RoomStatus;
    var participantCount : Nat;
  };

  // Shared (API-boundary) version of Room — no var fields
  public type RoomInfo = {
    code : Common.RoomCode;
    title : Text;
    createdBy : Text; // Principal as Text
    createdAt : Common.Timestamp;
    closedAt : ?Common.Timestamp;
    status : RoomStatus;
    participantCount : Nat;
  };

  public type ParticipantState = {
    userId : Principal;
    roomCode : Common.RoomCode;
    displayName : Text;
    var isMuted : Bool;
    var cameraOn : Bool;
    var screenSharing : Bool;
    var isActive : Bool;
    joinedAt : Common.Timestamp;
    var leftAt : ?Common.Timestamp;
  };

  // Shared (API-boundary) version of ParticipantState — no var fields
  public type ParticipantInfo = {
    userId : Text; // Principal as Text
    roomCode : Common.RoomCode;
    displayName : Text;
    isMuted : Bool;
    cameraOn : Bool;
    screenSharing : Bool;
    isActive : Bool;
    joinedAt : Common.Timestamp;
    leftAt : ?Common.Timestamp;
  };
};
