"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,

  CheckCircle,
  AlertCircle,
  Pause,
  Video,
  Clock,
  HardDrive,
  Zap,
} from "lucide-react";
import {
  useVideoUpload,
  CloudinaryUploadResponse,
} from "@/hooks/useVideoUpload";

interface AdvancedVideoUploadProps {
  onUploadComplete?: (data: CloudinaryUploadResponse) => void;
  onUploadError?: (error: string) => void;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
  className?: string;
  title?: string;
  description?: string;
}

export interface AdvancedVideoUploadRef {
  upload: () => Promise<CloudinaryUploadResponse | null>;
  reset: () => void;
  getSelectedFile: () => File | null;
  getUploadedVideo: () => CloudinaryUploadResponse | null;
}

export interface AdvancedVideoUploadRef {
  upload: () => Promise<CloudinaryUploadResponse | null>;
  reset: () => void;
  getSelectedFile: () => File | null;
  getUploadedVideo: () => CloudinaryUploadResponse | null;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDuration = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const engagingMessages = {
  preparing: [
    { icon: "🔍", text: "Analyzing your amazing video..." },
    { icon: "🛡️", text: "Running security checks..." },
    { icon: "⚙️", text: "Optimizing upload parameters..." },
    { icon: "🌐", text: "Establishing secure connection..." },
  ],
  uploading: [
    { icon: "🚀", text: "Launching your video to the cloud..." },
    { icon: "📡", text: "Beaming data at light speed..." },
    { icon: "💫", text: "Your video is traveling through cyberspace..." },
    { icon: "🌟", text: "Almost there! Hang tight..." },
    { icon: "⚡", text: "Turbo-charging the upload..." },
  ],
  processing: [
    { icon: "🎬", text: "Creating movie magic..." },
    { icon: "🎨", text: "Generating stunning thumbnails..." },
    { icon: "🔧", text: "Fine-tuning video quality..." },
    { icon: "🎭", text: "Preparing multiple playback formats..." },
    { icon: "✨", text: "Adding the finishing touches..." },
    { icon: "🎯", text: "Optimizing for best performance..." },
  ],
};

export const AdvancedVideoUpload = React.forwardRef<
  AdvancedVideoUploadRef,
  AdvancedVideoUploadProps
>(
  (
    {
      onUploadComplete,
      onUploadError,
      maxSize = 100,
      acceptedFormats = [".mp4", ".mov", ".avi", ".mkv", ".webm"],
      className = "",
      title = "Video Upload",
      description = "Upload your video content",
    },
    ref
  ) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [videoMetadata, setVideoMetadata] = useState<{
      duration: number;
      size: string;
      dimensions?: string;
    } | null>(null);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [isDragOver, setIsDragOver] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const messageIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const { uploadState, uploadVideo, cancelUpload, resetUpload } =
      useVideoUpload({
        onUploadComplete,
        onUploadError,
      });

    // Rotate messages during upload stages
    useEffect(() => {
      if (
        ["preparing", "uploading", "processing"].includes(uploadState.stage)
      ) {
        const messages =
          engagingMessages[uploadState.stage as keyof typeof engagingMessages];

        const rotateMessages = () => {
          setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
        };

        messageIntervalRef.current = setInterval(rotateMessages, 2500);

        return () => {
          if (messageIntervalRef.current) {
            clearInterval(messageIntervalRef.current);
          }
        };
      } else {
        setCurrentMessageIndex(0);
      }
    }, [uploadState.stage]);

    const validateFile = useCallback(
      (file: File): string | null => {
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
      },
      [maxSize, acceptedFormats]
    );

    const extractVideoMetadata = useCallback((file: File) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        setVideoMetadata({
          duration: video.duration,
          size: formatFileSize(file.size),
          dimensions: `${video.videoWidth}x${video.videoHeight}`,
        });
        URL.revokeObjectURL(video.src);
      };

      video.src = URL.createObjectURL(file);
    }, []);

    const handleFileSelect = useCallback(
      (file: File) => {
        const validationError = validateFile(file);
        if (validationError) {
          onUploadError?.(validationError);
          return;
        }

        setSelectedFile(file);

        // Create video preview
        const videoUrl = URL.createObjectURL(file);
        setPreview(videoUrl);

        // Extract metadata
        extractVideoMetadata(file);
      },
      [validateFile, extractVideoMetadata, onUploadError]
    );

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) handleFileSelect(file);
    };

    const handleDrop = useCallback(
      (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(false);

        const file = event.dataTransfer.files?.[0];
        if (file && file.type.startsWith("video/")) {
          handleFileSelect(file);
        }
      },
      [handleFileSelect]
    );

    const handleDragOver = useCallback(
      (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(true);
      },
      []
    );

    const handleDragLeave = useCallback(
      (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(false);
      },
      []
    );

    const handleUpload = useCallback(async (): Promise<CloudinaryUploadResponse | null> => {
      if (!selectedFile) return null;

      try {
        const result = await uploadVideo(selectedFile);
        return result || null;
      } catch (error) {
        // Error handling is done in the hook
        throw error;
      }
    }, [selectedFile, uploadVideo]);

    const handleReset = useCallback(() => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setSelectedFile(null);
      setPreview(null);
      setVideoMetadata(null);
      setCurrentMessageIndex(0);
      resetUpload();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, [preview, resetUpload]);

    const getCurrentMessage = () => {
      if (
        !["preparing", "uploading", "processing"].includes(uploadState.stage)
      ) {
        return null;
      }

      const messages =
        engagingMessages[uploadState.stage as keyof typeof engagingMessages];
      return messages[currentMessageIndex];
    };

    const getProgressColor = () => {
      switch (uploadState.stage) {
        case "preparing":
          return "bg-blue-500";
        case "uploading":
          return "bg-purple-500";
        case "processing":
          return "bg-orange-500";
        case "complete":
          return "bg-green-500";
        case "error":
          return "bg-red-500";
        default:
          return "bg-gray-500";
      }
    };

    // Expose methods through ref
    React.useImperativeHandle(
      ref,
      () => ({
        upload: handleUpload,
        reset: handleReset,
        getSelectedFile: () => selectedFile,
        getUploadedVideo: () => uploadState.response,
      }),
      [selectedFile, uploadState.response, handleUpload, handleReset]
    );

    return (
      <Card className={`w-full max-w-4xl mx-auto ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-6 w-6" />
            {title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Upload Area */}
          {!selectedFile && uploadState.stage === "idle" && (
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-200 ${
                isDragOver
                  ? "border-blue-400 bg-blue-50 scale-105"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="space-y-4">
                <div
                  className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                    isDragOver ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  <Upload
                    className={`h-8 w-8 ${
                      isDragOver ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                </div>

                <div>
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    {isDragOver
                      ? "Drop your video here!"
                      : "Choose a video file"}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Drag and drop or click to browse
                  </p>

                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {acceptedFormats.map((format) => (
                      <Badge
                        key={format}
                        variant="secondary"
                        className="text-xs"
                      >
                        {format.toUpperCase()}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-xs text-gray-400">
                    Maximum file size: {maxSize}MB
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* File Preview */}
          {selectedFile && preview && uploadState.stage === "idle" && (
            <div className="space-y-4">
              <div className="relative border rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  src={preview}
                  className="w-full h-64 object-contain"
                  controls
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleReset}
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedFile.type}
                      </p>
                    </div>
                  </div>

                  {videoMetadata && (
                    <>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Duration</p>
                          <p className="text-xs text-gray-500">
                            {formatDuration(videoMetadata.duration)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Size</p>
                          <p className="text-xs text-gray-500">
                            {videoMetadata.size}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploadState.isUploading && (
            <div className="space-y-6">
              {/* Animated Progress */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">
                    {getCurrentMessage()?.text || uploadState.message}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {uploadState.progress}%
                  </span>
                </div>

                <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ease-out ${getProgressColor()}`}
                    style={{ width: `${uploadState.progress}%` }}
                  >
                    <div className="h-full w-full bg-white bg-opacity-30 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Engaging Animation */}
              <div className="flex flex-col items-center py-8 space-y-4">
                <div className="relative">
                  <div
                    className={`w-20 h-20 border-4 border-gray-200 rounded-full animate-spin ${
                      uploadState.stage === "preparing"
                        ? "border-t-blue-500"
                        : uploadState.stage === "uploading"
                        ? "border-t-purple-500"
                        : "border-t-orange-500"
                    }`}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">
                    {getCurrentMessage()?.icon || "🎬"}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Processing your video with care...
                  </p>
                  <div className="flex justify-center space-x-2 text-xs">
                    <Badge
                      variant={
                        uploadState.stage === "preparing"
                          ? "default"
                          : "secondary"
                      }
                      className="transition-colors duration-300"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Preparing
                    </Badge>
                    <Badge
                      variant={
                        uploadState.stage === "uploading"
                          ? "default"
                          : "secondary"
                      }
                      className="transition-colors duration-300"
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      Uploading
                    </Badge>
                    <Badge
                      variant={
                        uploadState.stage === "processing"
                          ? "default"
                          : "secondary"
                      }
                      className="transition-colors duration-300"
                    >
                      <Video className="h-3 w-3 mr-1" />
                      Processing
                    </Badge>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={cancelUpload}
                  className="mt-4"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Cancel Upload
                </Button>
              </div>
            </div>
          )}

          {/* Success State */}
          {uploadState.stage === "complete" && uploadState.response && (
            <div className="text-center py-8 space-y-6">
              <div className="relative">
                <CheckCircle className="mx-auto h-20 w-20 text-green-500 animate-bounce" />
                <div className="absolute -top-2 -right-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full animate-ping"></div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-green-700">
                  🎉 Upload Successful!
                </h3>
                <p className="text-gray-600">
                  Your video has been uploaded and processed successfully
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Public ID:</span>
                    <span className="font-mono text-green-700">
                      {uploadState.response.public_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Format:</span>
                    <span className="uppercase">
                      {uploadState.response.format}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Size:</span>
                    <span>{formatFileSize(uploadState.response.bytes)}</span>
                  </div>
                  {uploadState.response.duration && (
                    <div className="flex justify-between">
                      <span className="font-medium">Duration:</span>
                      <span>
                        {formatDuration(uploadState.response.duration)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={handleReset}
                className="bg-green-600 hover:bg-green-700"
              >
                Upload Another Video
              </Button>
            </div>
          )}

          {/* Error State */}
          {uploadState.stage === "error" && (
            <div className="text-center py-8 space-y-4">
              <AlertCircle className="mx-auto h-16 w-16 text-red-500 animate-pulse" />
              <div>
                <p className="text-lg font-medium text-red-700 mb-2">
                  Upload Failed
                </p>
                <p className="text-sm text-gray-600 bg-red-50 border border-red-200 rounded-lg p-3 max-w-md mx-auto">
                  {uploadState.error}
                </p>
              </div>
              <Button onClick={handleReset} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          {selectedFile && uploadState.stage === "idle" && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleUpload}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                <Upload className="mr-2 h-5 w-5" />
                Start Upload
              </Button>
              <Button variant="outline" onClick={handleReset} size="lg">
                <X className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleInputChange}
            className="hidden"
          />
        </CardContent>
      </Card>
    );
  }
);

AdvancedVideoUpload.displayName = "AdvancedVideoUpload";
