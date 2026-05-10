import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SignalInfo {
    id: bigint;
    createdAt: Timestamp;
    toUser: string;
    consumed: boolean;
    fromUser: string;
    roomCode: RoomCode;
    payload: string;
    signalType: SignalType;
}
export interface RecordingInfo {
    id: bigint;
    createdAt: Timestamp;
    participantsCount: bigint;
    durationSeconds: DurationSeconds;
    roomCode: RoomCode;
    uploadedBy: string;
    fileUrl: Url;
}
export type Timestamp = bigint;
export interface MeetingHistoryEntry {
    title: string;
    date: Timestamp;
    role: Variant_host_participant;
    durationSeconds?: DurationSeconds;
    participantCount: bigint;
    roomCode: RoomCode;
}
export type RoomCode = string;
export interface StrokeInfo {
    id: bigint;
    userId: string;
    createdAt: Timestamp;
    path: string;
    color: string;
    width: bigint;
    roomCode: RoomCode;
}
export interface ParticipantInfo {
    screenSharing: boolean;
    displayName: string;
    userId: string;
    joinedAt: Timestamp;
    isActive: boolean;
    leftAt?: Timestamp;
    isMuted: boolean;
    roomCode: RoomCode;
    cameraOn: boolean;
}
export type DurationSeconds = bigint;
export interface RoomInfo {
    status: RoomStatus;
    title: string;
    code: RoomCode;
    createdAt: Timestamp;
    createdBy: string;
    closedAt?: Timestamp;
    participantCount: bigint;
}
export type Url = string;
export enum RoomStatus {
    closed = "closed",
    active = "active"
}
export enum SignalType {
    ice = "ice",
    offer = "offer",
    answer = "answer"
}
export enum Variant_host_participant {
    host = "host",
    participant = "participant"
}
export interface backendInterface {
    addStroke(roomCode: RoomCode, color: string, width: bigint, path: string): Promise<bigint>;
    clearWhiteboard(roomCode: RoomCode): Promise<void>;
    closeRoom(code: RoomCode): Promise<boolean>;
    consumeSignals(ids: Array<bigint>): Promise<bigint>;
    createRoom(title: string): Promise<RoomCode>;
    getPendingSignals(roomCode: RoomCode): Promise<Array<SignalInfo>>;
    getRecordingById(id: bigint): Promise<RecordingInfo | null>;
    getRoomInfo(code: RoomCode): Promise<RoomInfo | null>;
    getStrokes(roomCode: RoomCode): Promise<Array<StrokeInfo>>;
    joinRoom(roomCode: RoomCode, displayName: string): Promise<boolean>;
    leaveRoom(roomCode: RoomCode): Promise<boolean>;
    listMeetingHistory(): Promise<Array<MeetingHistoryEntry>>;
    listMyRecordings(): Promise<Array<RecordingInfo>>;
    listParticipants(roomCode: RoomCode): Promise<Array<ParticipantInfo>>;
    saveRecording(roomCode: RoomCode, durationSeconds: DurationSeconds, fileUrl: Url, participantsCount: bigint): Promise<bigint>;
    sendAnswer(toUser: Principal, roomCode: RoomCode, payload: string): Promise<bigint>;
    sendIce(toUser: Principal, roomCode: RoomCode, payload: string): Promise<bigint>;
    sendOffer(toUser: Principal, roomCode: RoomCode, payload: string): Promise<bigint>;
    updateMyState(roomCode: RoomCode, isMuted: boolean | null, cameraOn: boolean | null, screenSharing: boolean | null): Promise<boolean>;
}
