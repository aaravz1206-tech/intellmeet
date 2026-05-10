// Domain logic for recording metadata and meeting history
import CommonTypes "../types/common";
import RecordingTypes "../types/recordings";
import RoomTypes "../types/rooms";
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  /// Save recording metadata after upload
  public func saveRecording(
    recordings : List.List<RecordingTypes.Recording>,
    counter : Nat,
    roomCode : CommonTypes.RoomCode,
    uploadedBy : Principal,
    durationSeconds : CommonTypes.DurationSeconds,
    fileUrl : CommonTypes.Url,
    participantsCount : Nat,
  ) : Nat {
    let id = counter;
    let recording : RecordingTypes.Recording = {
      id;
      roomCode;
      uploadedBy;
      durationSeconds;
      fileUrl;
      participantsCount;
      createdAt = Time.now();
    };
    recordings.add(recording);
    id;
  };

  /// List all recordings uploaded by a user
  public func listRecordingsByUser(
    recordings : List.List<RecordingTypes.Recording>,
    user : Principal,
  ) : [RecordingTypes.RecordingInfo] {
    recordings
      .filter(func(r) { r.uploadedBy.equal(user) })
      .map<RecordingTypes.Recording, RecordingTypes.RecordingInfo>(toRecordingInfo)
      .toArray();
  };

  /// Convert internal Recording to shared RecordingInfo
  public func toRecordingInfo(r : RecordingTypes.Recording) : RecordingTypes.RecordingInfo {
    {
      id = r.id;
      roomCode = r.roomCode;
      uploadedBy = r.uploadedBy.toText();
      durationSeconds = r.durationSeconds;
      fileUrl = r.fileUrl;
      participantsCount = r.participantsCount;
      createdAt = r.createdAt;
    };
  };

  /// List meeting history for a user (rooms they created or joined)
  public func listMeetingHistory(
    rooms : Map.Map<CommonTypes.RoomCode, RoomTypes.Room>,
    participants : Map.Map<CommonTypes.RoomCode, List.List<RoomTypes.ParticipantState>>,
    recordings : List.List<RecordingTypes.Recording>,
    user : Principal,
  ) : [RecordingTypes.MeetingHistoryEntry] {
    let results = List.empty<RecordingTypes.MeetingHistoryEntry>();
    for ((code, room) in rooms.entries()) {
      let isHost = room.createdBy.equal(user);
      let isParticipant = switch (participants.get(code)) {
        case (?pList) {
          pList.any(func(p : RoomTypes.ParticipantState) : Bool { p.userId.equal(user) });
        };
        case null { false };
      };
      if (isHost or isParticipant) {
        // Find recording duration for this room if one exists
        let recOpt = recordings.values().find(func(r : RecordingTypes.Recording) : Bool { r.roomCode == code });
        let durationSeconds : ?CommonTypes.DurationSeconds = switch (recOpt) {
          case (?rec) { ?rec.durationSeconds };
          case null { null };
        };
        let role : { #host; #participant } = if (isHost) { #host } else { #participant };
        let entry : RecordingTypes.MeetingHistoryEntry = {
          roomCode = code;
          title = room.title;
          date = room.createdAt;
          durationSeconds;
          participantCount = room.participantCount;
          role;
        };
        results.add(entry);
      };
    };
    results.toArray();
  };
};
