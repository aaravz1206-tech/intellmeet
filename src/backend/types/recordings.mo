// Recording metadata and meeting history types for IntellMeet
import Common "common";
import Principal "mo:core/Principal";

module {
  public type Recording = {
    id : Nat;
    roomCode : Common.RoomCode;
    uploadedBy : Principal;
    durationSeconds : Common.DurationSeconds;
    fileUrl : Common.Url;
    participantsCount : Nat;
    createdAt : Common.Timestamp;
  };

  // Shared version (uploadedBy as Text)
  public type RecordingInfo = {
    id : Nat;
    roomCode : Common.RoomCode;
    uploadedBy : Text; // Principal as Text
    durationSeconds : Common.DurationSeconds;
    fileUrl : Common.Url;
    participantsCount : Nat;
    createdAt : Common.Timestamp;
  };

  public type MeetingHistoryEntry = {
    roomCode : Common.RoomCode;
    title : Text;
    date : Common.Timestamp;
    durationSeconds : ?Common.DurationSeconds;
    participantCount : Nat;
    role : { #host; #participant };
  };
};
