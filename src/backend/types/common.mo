// Cross-cutting types shared across all IntellMeet domains
import Time "mo:core/Time";

module {
  /// Unique room identifier — 6-character alphanumeric code
  public type RoomCode = Text;

  /// Stable nanosecond timestamp (Int from Time.now())
  public type Timestamp = Int;

  /// Duration in seconds
  public type DurationSeconds = Nat;

  /// URL string for file references
  public type Url = Text;
};
