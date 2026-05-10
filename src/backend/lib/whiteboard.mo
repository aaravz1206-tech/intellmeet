// Domain logic for real-time whiteboard strokes
import CommonTypes "../types/common";
import WhiteboardTypes "../types/whiteboard";
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  /// Add a stroke event to a room's whiteboard
  public func addStroke(
    strokes : Map.Map<CommonTypes.RoomCode, List.List<WhiteboardTypes.Stroke>>,
    counter : Nat,
    roomCode : CommonTypes.RoomCode,
    userId : Principal,
    color : Text,
    width : Nat,
    path : Text,
  ) : Nat {
    let id = counter;
    let stroke : WhiteboardTypes.Stroke = {
      id;
      roomCode;
      userId;
      color;
      width;
      path;
      createdAt = Time.now();
    };
    switch (strokes.get(roomCode)) {
      case (?list) { list.add(stroke) };
      case null {
        let list = List.empty<WhiteboardTypes.Stroke>();
        list.add(stroke);
        strokes.add(roomCode, list);
      };
    };
    id;
  };

  /// Get all strokes for a room
  public func getStrokes(
    strokes : Map.Map<CommonTypes.RoomCode, List.List<WhiteboardTypes.Stroke>>,
    roomCode : CommonTypes.RoomCode,
  ) : [WhiteboardTypes.StrokeInfo] {
    switch (strokes.get(roomCode)) {
      case (?list) {
        list.map<WhiteboardTypes.Stroke, WhiteboardTypes.StrokeInfo>(toStrokeInfo).toArray();
      };
      case null { [] };
    };
  };

  /// Clear all strokes for a room
  public func clearStrokes(
    strokes : Map.Map<CommonTypes.RoomCode, List.List<WhiteboardTypes.Stroke>>,
    roomCode : CommonTypes.RoomCode,
  ) : () {
    switch (strokes.get(roomCode)) {
      case (?list) { list.clear() };
      case null {};
    };
  };

  /// Convert internal Stroke to shared StrokeInfo
  public func toStrokeInfo(s : WhiteboardTypes.Stroke) : WhiteboardTypes.StrokeInfo {
    {
      id = s.id;
      roomCode = s.roomCode;
      userId = s.userId.toText();
      color = s.color;
      width = s.width;
      path = s.path;
      createdAt = s.createdAt;
    };
  };
};
