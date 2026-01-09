import { useState, useRef, useCallback } from "react";

interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  playback_url?: string;
  folder?: string;
  access_mode?: string;
  audio?: {
    codec: string;
    bit_rate: string;
    frequency: number;
    channels: number;
    channel_layout: string;
  };
  video?: {
    pix_format: string;
    codec: string;
    level: number;
    profile: string;
    bit_rate: string;
    time_base: string;
  };
  is_audio: boolean;
  frame_rate?: number;
  bit_rate?: number;
  duration?: number;
  rotation?: number;
  original_filename?: string;
  nb_frames?: number;
  error?: {
    message: string;
  };
}

interface UseVideoUploadOptions {
  cloudName?: string;
  uploadPreset?: string;
  onUploadStart?: () => void;
  onUploadProgress?: (progress: number) => void;
  onUploadComplete?: (response: CloudinaryUploadResponse) => void;
  onUploadError?: (error: string) => void;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  stage:
    | "idle"
    | "preparing"
    | "uploading"
    | "processing"
    | "complete"
    | "error";
  message: string;
  error: string | null;
  response: CloudinaryUploadResponse | null;
}

export function useVideoUpload(options: UseVideoUploadOptions = {}) {
  const {
    cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "cy-tests",
    uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
      "secure_video_upload",
    onUploadStart,
    onUploadProgress,
    onUploadComplete,
    onUploadError,
  } = options;

  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    stage: "idle",
    message: "",
    error: null,
    response: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const updateState = useCallback((updates: Partial<UploadState>) => {
    setUploadState((prev) => ({ ...prev, ...updates }));
  }, []);

  const uploadVideo = useCallback(
    async (file: File) => {
      if (!file) return;

      // Reset state
      updateState({
        isUploading: true,
        progress: 0,
        stage: "preparing",
        message: "Preparing video for upload...",
        error: null,
        response: null,
      });

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      try {
        onUploadStart?.();

        // Simulate preparation time
        await new Promise((resolve) => setTimeout(resolve, 1000));

        updateState({
          stage: "uploading",
          progress: 20,
          message: "Uploading video to cloud...",
        });

        // Prepare form data
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        formData.append("resource_type", "video");

        // Upload to Cloudinary
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
          {
            method: "POST",
            body: formData,
            signal: abortControllerRef.current.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        updateState({
          stage: "processing",
          progress: 80,
          message: "Processing video...",
        });

        const data: CloudinaryUploadResponse = await response.json();

        if (data.error) {
          throw new Error((data as any).error.message);
        }

        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 1500));

        updateState({
          isUploading: false,
          stage: "complete",
          progress: 100,
          message: "Video uploaded successfully!",
          response: data,
        });

        onUploadComplete?.(data);
        return data;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          updateState({
            isUploading: false,
            stage: "idle",
            progress: 0,
            message: "Upload cancelled",
            error: "Upload was cancelled",
          });
        } else {
          const errorMessage =
            error instanceof Error ? error.message : "Upload failed";
          updateState({
            isUploading: false,
            stage: "error",
            progress: 0,
            message: "Upload failed",
            error: errorMessage,
          });
          onUploadError?.(errorMessage);
        }
        throw error;
      } finally {
        abortControllerRef.current = null;
      }
    },
    [
      cloudName,
      uploadPreset,
      onUploadStart,
      onUploadComplete,
      onUploadError,
      updateState,
    ]
  );

  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const resetUpload = useCallback(() => {
    cancelUpload();
    setUploadState({
      isUploading: false,
      progress: 0,
      stage: "idle",
      message: "",
      error: null,
      response: null,
    });
  }, [cancelUpload]);

  return {
    uploadState,
    uploadVideo,
    cancelUpload,
    resetUpload,
    isUploading: uploadState.isUploading,
  };
}

export type { CloudinaryUploadResponse, UploadState };
