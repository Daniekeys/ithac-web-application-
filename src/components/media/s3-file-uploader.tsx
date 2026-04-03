"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, FileVideo, ImageIcon, FileIcon, AlertCircle } from "lucide-react";
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

interface S3FileUploaderProps {
  folder: "courses/videos" | "courses/images" | "courses/thumbnails" | "courses/resources";
  accept?: string;
  maxSize?: number; // Size in MB
  title?: string;
  description?: string;
  value?: string; // Existing URL to preview
  onUploadComplete?: (data: S3UploadResponse | null) => void;
  onUploadError?: (error: string) => void;
  previewType?: "image" | "video" | "raw";
  className?: string;
}

export function S3FileUploader({
  folder,
  accept = "*/*",
  maxSize = 500,
  title = "Upload File",
  description = "Drag and drop a file here, or click to select",
  value,
  onUploadComplete,
  onUploadError,
  previewType = "raw",
  className,
}: S3FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync value from props if it changes externally
  useEffect(() => {
    if (value !== undefined) {
      setPreviewUrl(value);
    }
  }, [value]);

  const resetState = useCallback(() => {
    setFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onUploadComplete) {
      onUploadComplete(null);
    }
  }, [onUploadComplete]);

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

    setFile(selectedFile);
  };

  const getVideoDuration = (videoFile: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = () => {
        resolve(0); // fallback
      };
      video.src = URL.createObjectURL(videoFile);
    });
  };

  const getSafeMimeType = (file: File) => {
    if (file.type.startsWith("image/")) return file.type;

    const ext = file.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case "mp4":
        return "video/mp4";
      case "mov":
        return "video/quicktime";
      case "webm":
        return "video/webm";
      case "avi":
        return "video/x-msvideo";
      case "mkv":
        return "video/mp4"; // Fallback to mp4 for mkv to avoid matroska mime-type issues
      default:
        return file.type || "application/octet-stream";
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);
    setError(null);

    const safeMimeType = getSafeMimeType(file);

    try {
      // Step 1: Get presigned URL
      const presignResponse = await fetch("https://ithac.onrender.com/v1/upload/presign", {
        method: "POST",
        body: JSON.stringify({ folder, mimetype: safeMimeType }),
        headers: { "Content-Type": "application/json" },
      });

      if (!presignResponse.ok) {
        throw new Error("Failed to get presigned upload URL from server");
      }

      setUploadProgress(30);

      const { uploadUrl, fileUrl } = await presignResponse.json();

      if (!uploadUrl || !fileUrl) {
        throw new Error("Invalid presigned response from server");
      }

      let duration = 0;
      if (file.type.startsWith("video/") || safeMimeType.startsWith("video/")) {
        duration = await getVideoDuration(file);
      }
      
      setUploadProgress(40);

      // Step 2: PUT file directly to S3
      const uploadReq = new XMLHttpRequest();
      
      uploadReq.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 55;
          setUploadProgress(40 + percentComplete);
        }
      });

      const s3UploadPromise = new Promise((resolve, reject) => {
        uploadReq.addEventListener("load", () => {
          if (uploadReq.status >= 200 && uploadReq.status < 300) {
            resolve(uploadReq.status);
          } else {
            reject(new Error(`S3 Upload failed with status: ${uploadReq.status}`));
          }
        });
        uploadReq.addEventListener("error", () => reject(new Error("Network error during upload to S3")));
        uploadReq.addEventListener("abort", () => reject(new Error("Upload aborted")));
      });

      uploadReq.open("PUT", uploadUrl);
      uploadReq.setRequestHeader("Content-Type", safeMimeType);
      uploadReq.send(file);

      await s3UploadPromise;

      setUploadProgress(100);
      setPreviewUrl(fileUrl);
      setFile(null); // Clear local file, show remote preview

      const responseData: S3UploadResponse = {
        secure_url: fileUrl,
        original_filename: file.name,
        bytes: file.size,
        format: file.name.split('.').pop() || "unknown",
        duration: duration > 0 ? duration : undefined,
      };

      if (onUploadComplete) {
        onUploadComplete(responseData);
      }
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during upload.");
      setIsUploading(false);
      setUploadProgress(0);
      if (onUploadError) onUploadError(err.message || "Upload failed");
    }
  };

  const getIcon = () => {
    if (previewType === "video") return <FileVideo className="h-8 w-8" />;
    if (previewType === "image") return <ImageIcon className="h-8 w-8" />;
    return <Upload className="h-8 w-8" />;
  };

  // If a previewUrl exists, show the uploaded preview
  if (previewUrl && !isUploading && !file) {
    return (
      <div className={cn("w-full bg-white border rounded-xl overflow-hidden shadow-sm", className)}>
        <div className="relative">
          {previewType === "image" && (
            <img src={previewUrl} alt="Preview" className="w-full h-auto max-h-64 object-contain bg-gray-50" />
          )}
          {previewType === "video" && (
            <video src={previewUrl} controls className="w-full h-auto max-h-64 bg-black object-contain" />
          )}
          {previewType === "raw" && (
            <div className="flex items-center justify-center p-8 bg-gray-50 text-gray-400">
              <FileIcon className="h-16 w-16" />
            </div>
          )}
          
          <div className="absolute top-2 right-2">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={resetState}
              className="h-8 w-8 rounded-full shadow-lg"
              title="Remove File"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-3 text-sm text-gray-600 truncate bg-gray-50 border-t">
          <a href={previewUrl} target="_blank" rel="noreferrer" className="hover:underline text-blue-600 break-all w-full block">
            {previewUrl}
          </a>
        </div>
      </div>
    );
  }

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
              {getIcon()}
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>

            <div className="text-xs text-gray-400">
              {accept !== "*/*" && <>Supported formats: {accept}<br/></>}
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
                {getIcon()}
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
        accept={accept}
        className="hidden"
      />
    </div>
  );
}
