"use client";

import React, { useState, useRef, useCallback } from "react";
import { CloudinaryUploadResponse } from "@/hooks/useVideoUpload";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";

interface VideoUploadProps {
  onUploadComplete?: (data: CloudinaryUploadResponse) => void;
  onUploadError?: (error: string) => void;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
  className?: string;
}

export interface VideoUploadRef {
  upload: () => Promise<CloudinaryUploadResponse | null>;
  reset: () => void;
  getSelectedFile: () => File | null;
}

export interface VideoUploadRef {
  upload: () => Promise<CloudinaryUploadResponse | null>;
  reset: () => void;
  getSelectedFile: () => File | null;
}

interface UploadProgress {
  stage:
    | "idle"
    | "preparing"
    | "uploading"
    | "processing"
    | "complete"
    | "error";
  progress: number;
  message: string;
  details?: string;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "cy-tests";
const UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "secure_video_upload";

const uploadStages = [
  {
    stage: "preparing",
    messages: [
      "Preparing your video for upload...",
      "Validating video format and size...",
      "Optimizing upload parameters...",
      "Establishing secure connection...",
    ],
  },
  {
    stage: "uploading",
    messages: [
      "Uploading your video to the cloud...",
      "Transferring video data securely...",
      "Video upload in progress...",
      "Almost there, please wait...",
    ],
  },
  {
    stage: "processing",
    messages: [
      "Processing your video...",
      "Generating video thumbnails...",
      "Optimizing video quality...",
      "Creating playback formats...",
      "Finalizing video processing...",
    ],
  },
];

export const VideoUpload = React.forwardRef<VideoUploadRef, VideoUploadProps>(
  (
    {
      onUploadComplete,
      onUploadError,
      maxSize = 100,
      acceptedFormats = [".mp4", ".mov", ".avi", ".mkv"],
      className = "",
    },
    ref
  ) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
      stage: "idle",
      progress: 0,
      message: "",
      details: "",
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const messageIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const clearMessageInterval = useCallback(() => {
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
        messageIntervalRef.current = null;
      }
    }, []);

    const startMessageRotation = useCallback(
      (stage: "preparing" | "uploading" | "processing") => {
        clearMessageInterval();

        const stageData = uploadStages.find((s) => s.stage === stage);
        if (!stageData) return;

        let messageIndex = 0;

        const updateMessage = () => {
          setUploadProgress((prev) => ({
            ...prev,
            message: stageData.messages[messageIndex],
            details: `Step ${messageIndex + 1} of ${stageData.messages.length}`,
          }));
          messageIndex = (messageIndex + 1) % stageData.messages.length;
        };

        updateMessage(); // Set initial message
        messageIntervalRef.current = setInterval(updateMessage, 2000);
      },
      [clearMessageInterval]
    );

    const validateFile = (file: File): string | null => {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSize) {
        return `File size (${fileSizeMB.toFixed(
          1
        )}MB) exceeds maximum allowed size of ${maxSize}MB`;
      }

      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!acceptedFormats.includes(fileExtension)) {
        return `File format ${fileExtension} is not supported. Accepted formats: ${acceptedFormats.join(
          ", "
        )}`;
      }

      return null;
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const validationError = validateFile(file);
      if (validationError) {
        setUploadProgress({
          stage: "error",
          progress: 0,
          message: "File validation failed",
          details: validationError,
        });
        return;
      }

      setSelectedFile(file);

      // Create video preview
      const videoUrl = URL.createObjectURL(file);
      setPreview(videoUrl);

      setUploadProgress({
        stage: "idle",
        progress: 0,
        message: `Selected: ${file.name}`,
        details: `Size: ${(file.size / (1024 * 1024)).toFixed(1)}MB`,
      });
    };

    const handleUpload = useCallback(async (): Promise<CloudinaryUploadResponse | null> => {
      if (!selectedFile) return null;

      try {
        // Preparing stage
        setUploadProgress({
          stage: "preparing",
          progress: 10,
          message: "Preparing your video for upload...",
          details: "Step 1 of 4",
        });
        startMessageRotation("preparing");

        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Uploading stage
        setUploadProgress({
          stage: "uploading",
          progress: 25,
          message: "Uploading your video to the cloud...",
          details: "Step 1 of 4",
        });
        startMessageRotation("uploading");

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("resource_type", "video");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        // Processing stage
        setUploadProgress({
          stage: "processing",
          progress: 75,
          message: "Processing your video...",
          details: "Step 1 of 5",
        });
        startMessageRotation("processing");

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error.message);
        }

        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Complete
        clearMessageInterval();
        setUploadProgress({
          stage: "complete",
          progress: 100,
          message: "Video uploaded successfully!",
          details: `Public ID: ${data.public_id}`,
        });

        onUploadComplete?.(data);
        return data; // Return the response directly
      } catch (error) {
        clearMessageInterval();
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";

        setUploadProgress({
          stage: "error",
          progress: 0,
          message: "Upload failed",
          details: errorMessage,
        });

        onUploadError?.(errorMessage);
        throw error; // Re-throw error so caller can catch it
      }

    }, [selectedFile, startMessageRotation, clearMessageInterval, onUploadComplete, onUploadError]);

    const handleReset = useCallback(() => {
      clearMessageInterval();
      setSelectedFile(null);
      setPreview(null);
      setUploadProgress({
        stage: "idle",
        progress: 0,
        message: "",
        details: "",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, [clearMessageInterval]);

    const handleRemoveFile = () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      handleReset();
    };

    const isUploading = ["preparing", "uploading", "processing"].includes(
      uploadProgress.stage
    );



    React.useImperativeHandle(
      ref,
      () => ({
        upload: handleUpload,
        reset: handleReset,
        getSelectedFile: () => selectedFile,
      }),
      [handleUpload, handleReset, selectedFile]
    );

    return (
      <Card className={`w-full max-w-2xl mx-auto ${className}`}>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* File Input Area */}
            {!selectedFile && uploadProgress.stage === "idle" && (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Click to select a video file
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats: {acceptedFormats.join(", ")} • Max size:{" "}
                  {maxSize}MB
                </p>
              </div>
            )}

            {/* File Preview */}
            {selectedFile && preview && uploadProgress.stage === "idle" && (
              <div className="relative border rounded-lg overflow-hidden">
                <video
                  src={preview}
                  className="w-full h-48 object-cover"
                  controls
                />
                <div className="absolute top-2 right-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4 bg-white">
                  <p className="font-medium truncate">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(1)}MB
                  </p>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      {uploadProgress.message}
                    </span>
                    <span className="text-sm text-gray-500">
                      {uploadProgress.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress.progress}%` }}
                    />
                  </div>
                  {uploadProgress.details && (
                    <p className="text-xs text-gray-500 animate-pulse">
                      {uploadProgress.details}
                    </p>
                  )}
                </div>

                {/* Upload Animation */}
                <div className="flex items-center justify-center py-8">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                    <Upload className="absolute inset-0 m-auto h-6 w-6 text-blue-600" />
                  </div>
                </div>

                {/* Stage Indicator */}
                <div className="flex justify-center space-x-4 text-xs">
                  <div
                    className={`px-2 py-1 rounded ${
                      uploadProgress.stage === "preparing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    Preparing
                  </div>
                  <div
                    className={`px-2 py-1 rounded ${
                      uploadProgress.stage === "uploading"
                        ? "bg-blue-100 text-blue-800"
                        : uploadProgress.progress > 25
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    Uploading
                  </div>
                  <div
                    className={`px-2 py-1 rounded ${
                      uploadProgress.stage === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : uploadProgress.progress === 100
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    Processing
                  </div>
                </div>
              </div>
            )}

            {/* Success State */}
            {uploadProgress.stage === "complete" && (
              <div className="text-center py-8 space-y-4">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                <div>
                  <p className="text-lg font-medium text-green-700">
                    {uploadProgress.message}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {uploadProgress.details}
                  </p>
                </div>
                <Button onClick={handleReset} variant="outline">
                  Upload Another Video
                </Button>
              </div>
            )}

            {/* Error State */}
            {uploadProgress.stage === "error" && (
              <div className="text-center py-8 space-y-4">
                <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
                <div>
                  <p className="text-lg font-medium text-red-700">
                    {uploadProgress.message}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {uploadProgress.details}
                  </p>
                </div>
                <Button onClick={handleReset} variant="outline">
                  Try Again
                </Button>
              </div>
            )}

            {/* Action Buttons */}
            {selectedFile && uploadProgress.stage === "idle" && (
              <div className="flex space-x-3">
                <Button
                  onClick={handleUpload}
                  className="flex-1"
                  disabled={isUploading}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Video
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRemoveFile}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>
    );
  }
);

VideoUpload.displayName = "VideoUpload";
