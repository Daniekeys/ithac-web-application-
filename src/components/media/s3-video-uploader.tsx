"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, FileVideo, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface S3UploadResponse {
  secure_url: string;
  original_filename: string;
  bytes: number;
  format: string;
  duration?: number;
}

interface S3VideoUploaderProps {
  onUploadComplete?: (data: S3UploadResponse) => void;
  onUploadError?: (error: string) => void;
  maxSize?: number; // Size in MB
  acceptedFormats?: string[];
  title?: string;
  description?: string;
  className?: string;
}

export function S3VideoUploader({
  onUploadComplete,
  onUploadError,
  maxSize = 500,
  acceptedFormats = [".mp4", ".mov", ".avi", ".mkv", ".webm"],
  title = "Upload Video",
  description = "Drag and drop a video file here, or click to select",
  className,
}: S3VideoUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
    setFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    
    // Check file size
    const fileSizeMB = selectedFile.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`File size exceeds the ${maxSize}MB limit.`);
      return;
    }

    // Attempt to check format but checking extension is not perfectly reliable without MIME or S3 settings 
    // mostly handled by S3 and input accept attribute but good to double check.
    const fileExtension = `.${selectedFile.name.split('.').pop()?.toLowerCase()}`;
    if (acceptedFormats.length > 0 && !acceptedFormats.includes(fileExtension)) {
      setError(`Invalid file format. Accepted formats: ${acceptedFormats.join(", ")}`);
      return;
    }

    setFile(selectedFile);
  };

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = () => {
        resolve(0); // fallback if duration cannot be extracted
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);
    setError(null);

    try {
      // Step 1: Get presigned URL
      const presignResponse = await fetch("/upload/presign", {
        method: "POST",
        body: JSON.stringify({ folder: "courses/videos", mimetype: file.type || "video/mp4" }),
        headers: { "Content-Type": "application/json" },
      });

      if (!presignResponse.ok) {
        throw new Error("Failed to get presigned upload URL");
      }

      setUploadProgress(30);

      const { uploadUrl, fileUrl } = await presignResponse.json();

      if (!uploadUrl || !fileUrl) {
        throw new Error("Invalid presigned response");
      }

      // We'll extract duration from the local file before finishing
      const duration = await getVideoDuration(file);
      setUploadProgress(40);

      // Step 2: PUT file directly to S3
      const uploadReq = new XMLHttpRequest();
      
      uploadReq.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          // Progress from 40 to 95 during S3 upload
          const percentComplete = (event.loaded / event.total) * 55;
          setUploadProgress(40 + percentComplete);
        }
      });

      const s3UploadPromise = new Promise((resolve, reject) => {
        uploadReq.addEventListener("load", () => {
          if (uploadReq.status >= 200 && uploadReq.status < 300) {
            resolve(uploadReq.status);
          } else {
            reject(new Error(`S3 Upload failed: ${uploadReq.status}`));
          }
        });
        uploadReq.addEventListener("error", () => reject(new Error("Network error during upload")));
        uploadReq.addEventListener("abort", () => reject(new Error("Upload aborted")));
      });

      uploadReq.open("PUT", uploadUrl);
      uploadReq.setRequestHeader("Content-Type", file.type || "video/mp4");
      uploadReq.send(file);

      await s3UploadPromise;

      setUploadProgress(100);

      const responseData: S3UploadResponse = {
        secure_url: fileUrl,
        original_filename: file.name,
        bytes: file.size,
        format: file.name.split('.').pop() || "mp4",
        duration: duration > 0 ? duration : undefined,
      };

      if (onUploadComplete) {
        onUploadComplete(responseData);
      }
      
      resetState();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during upload.");
      setIsUploading(false);
      if (onUploadError) onUploadError(err.message || "Upload failed");
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {!file && !isUploading && (
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-8 transition-all duration-200 ease-in-out text-center cursor-pointer",
            isDragging
              ? "border-blue-500 bg-blue-50/50"
              : "border-gray-200 hover:border-blue-400 hover:bg-gray-50",
            error && "border-red-300 bg-red-50/50"
          )}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const droppedFile = e.dataTransfer.files?.[0];
            if (droppedFile) {
              validateAndSetFile(droppedFile);
            }
          }}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div
              className={cn(
                "p-4 rounded-full",
                isDragging ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500",
                error && "bg-red-100 text-red-500"
              )}
            >
              <Upload className="h-8 w-8" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>

            <div className="text-xs text-gray-400">
              Supported formats: {acceptedFormats.join(", ")}
              <br />
              Maximum size: {maxSize}MB
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 py-2 px-3 rounded-md w-full max-w-md mt-4">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="text-left">{error}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {file && (
        <div className="bg-white border rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <FileVideo className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 line-clamp-1 break-all">
                  {file.name}
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                  <span>•</span>
                  <span className="uppercase">{file.name.split('.').pop()}</span>
                </div>
              </div>
            </div>
            
            {!isUploading && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={resetState}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 py-2 px-3 rounded-md">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isUploading ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm font-medium">
                <span className={uploadProgress === 100 ? "text-green-600" : "text-blue-600"}>
                  {uploadProgress === 100 ? "Upload Complete!" : "Uploading..."}
                </span>
                <span className="text-gray-600">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress 
                value={uploadProgress} 
                className={cn("h-2", uploadProgress === 100 && "[&>div]:bg-green-500")} 
              />
              <p className="text-xs text-gray-500 text-center">
                Please don't close this window while the upload is in progress.
              </p>
            </div>
          ) : (
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={resetState}>
                Cancel
              </Button>
              <Button type="button" onClick={handleUpload}>
                <Upload className="h-4 w-4 mr-2" />
                Start Upload
              </Button>
            </div>
          )}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedFormats.join(",")}
        className="hidden"
      />
    </div>
  );
}
