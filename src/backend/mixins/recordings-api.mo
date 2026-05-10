// Public API mixin for recordings and meeting history
import CommonTypes "../types/common";
import RecordingTypes "../types/recordings";
import RoomTypes "../types/rooms";
import Map "mo:core/Map";
import List "mo:core/List";
import RecordingsLib "../lib/recordings";

mixin (
  recordings : List.List<RecordingTypes.Recording>,
  rooms : Map.Map<CommonTypes.RoomCode, RoomTypes.Room>,
  participants : Map.Map<CommonTypes.RoomCode, List.List<RoomTypes.ParticipantState>>,
  state : { var recordingCounter : Nat },
) {
  /// Save recording metadata after a successful upload
  public shared ({ caller }) func saveRecording(
    roomCode : CommonTypes.RoomCode,
    durationSeconds : CommonTypes.DurationSeconds,
    fileUrl : CommonTypes.Url,
    participantsCount : Nat,
  ) : async Nat {
    let id = state.recordingCounter;
    state.recordingCounter += 1;
    RecordingsLib.saveRecording(recordings, id, roomCode, caller, durationSeconds, fileUrl, participantsCount);
  };

  /// List all recordings uploaded by the caller
  public shared ({ caller }) func listMyRecordings() : async [RecordingTypes.RecordingInfo] {
    RecordingsLib.listRecordingsByUser(recordings, caller);
  };

  /// List meeting history for the caller (created or joined)
  public shared ({ caller }) func listMeetingHistory() : async [RecordingTypes.MeetingHistoryEntry] {
    RecordingsLib.listMeetingHistory(rooms, participants, recordings, caller);
  };
  /// Get a single recording by ID
  public shared query ({ caller }) func getRecordingById(id : Nat) : async ?RecordingTypes.RecordingInfo {
    switch (recordings.find(func(r : RecordingTypes.Recording) : Bool { r.id == id })) {
      case (?r) { ?RecordingsLib.toRecordingInfo(r) };
      case null { null };
    };
  };
};
