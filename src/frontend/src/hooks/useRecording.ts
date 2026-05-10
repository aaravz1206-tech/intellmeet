import { ExternalBlob } from "@caffeineai/object-storage";
import { useCallback, useRef } from "react";
import { toast } from "sonner";

interface UseRecordingOptions {
  onSave?: (
    url: string,
    durationSeconds: number,
    blobSize: number,
  ) => Promise<void>;
}

export interface RecordingControls {
  startRecording: (stream: MediaStream) => void;
  stopRecording: () => void;
  isSupported: boolean;
}

export function useRecording({
  onSave,
}: UseRecordingOptions = {}): RecordingControls {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);

  const isSupported = typeof MediaRecorder !== "undefined";

  const startRecording = useCallback(
    (stream: MediaStream) => {
      if (!isSupported) {
        toast.error("Recording is not supported in this browser");
        return;
      }

      // Try preferred codec, fallback to default
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : MediaRecorder.isTypeSupported("video/webm")
          ? "video/webm"
          : "";

      const options = mimeType ? { mimeType } : {};
      const mr = new MediaRecorder(stream, options);
      chunksRef.current = [];
      startTimeRef.current = Date.now();

      mr.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mr.onstop = async () => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const blob = new Blob(chunksRef.current, {
          type: mimeType || "video/webm",
        });

        try {
          // Convert to ExternalBlob and upload via object-storage extension
          const bytes = new Uint8Array(await blob.arrayBuffer());
          const externalBlob = ExternalBlob.fromBytes(bytes).withUploadProgress(
            (pct) => {
              if (pct < 100) {
                toast.loading(`Uploading recording: ${pct}%`, {
                  id: "recording-upload",
                });
              }
            },
          );

          const uploadUrl = externalBlob.getDirectURL();
          toast.dismiss("recording-upload");
          toast.success("Recording uploaded successfully");

          if (onSave) {
            await onSave(uploadUrl, elapsed, blob.size);
          }
        } catch (err) {
          console.error("Recording upload failed:", err);
          toast.error("Failed to upload recording");
          // Fallback: create local object URL
          const fallbackUrl = URL.createObjectURL(blob);
          if (onSave) {
            await onSave(fallbackUrl, elapsed, blob.size);
          }
        }
      };

      mr.start(1000); // collect chunks every 1s
      mediaRecorderRef.current = mr;
    },
    [isSupported, onSave],
  );

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
  }, []);

  return { startRecording, stopRecording, isSupported };
}
