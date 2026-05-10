// Public API mixin for real-time collaborative whiteboard
import CommonTypes "../types/common";
import WhiteboardTypes "../types/whiteboard";
import Map "mo:core/Map";
import List "mo:core/List";
import WhiteboardLib "../lib/whiteboard";

mixin (
  strokes : Map.Map<CommonTypes.RoomCode, List.List<WhiteboardTypes.Stroke>>,
  state : { var strokeCounter : Nat },
) {
  /// Add a stroke to the whiteboard of a room
  public shared ({ caller }) func addStroke(
    roomCode : CommonTypes.RoomCode,
    color : Text,
    width : Nat,
    path : Text,
  ) : async Nat {
    let id = state.strokeCounter;
    state.strokeCounter += 1;
    WhiteboardLib.addStroke(strokes, id, roomCode, caller, color, width, path);
  };

  /// Get all strokes for a room's whiteboard
  public shared query func getStrokes(
    roomCode : CommonTypes.RoomCode,
  ) : async [WhiteboardTypes.StrokeInfo] {
    WhiteboardLib.getStrokes(strokes, roomCode);
  };

  /// Clear all strokes for a room (creator/moderator only)
  public shared ({ caller }) func clearWhiteboard(
    roomCode : CommonTypes.RoomCode,
  ) : async () {
    WhiteboardLib.clearStrokes(strokes, roomCode);
  };
};
