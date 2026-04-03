"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CloudinaryImageUploadProps {
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: string) => void;
  maxSize?: number; // Size in MB
  title?: string;
  description?: string;
  value?: string;
  className?: string;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "cy-tests";
const UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "secure_video_upload";

export function CloudinaryImageUpload({
  onUploadComplete,
  onUploadError,
  maxSize = 10, // 10MB typical image max
  title = "Upload Image",
  description = "Drag and drop an image file here, or click to select",
  value,
  className,
}: CloudinaryImageUploadProps) {
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  // If a previewUrl exists, show the uploaded preview
  if (previewUrl && !isUploading && !file) {
    return (
      <div
        className={cn(
          "w-full bg-white border rounded-xl overflow-hidden shadow-sm",
          className,
        )}
      >
        <div className="relative group">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-auto max-h-64 object-contain bg-gray-50"
          />

          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => {
                setPreviewUrl(null);
                if (onUploadComplete) onUploadComplete(""); // Clear the value in form
              }}
              className="h-8 w-8 rounded-full shadow-lg"
              title="Remove Image"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

    if (!selectedFile.type.startsWith("image/")) {
      setError("Invalid file format. Please pick an image file.");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("resource_type", "image");

    try {
      const uploadReq = new XMLHttpRequest();

      uploadReq.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      const cloudinaryUploadPromise = new Promise<any>((resolve, reject) => {
        uploadReq.addEventListener("load", () => {
          if (uploadReq.status >= 200 && uploadReq.status < 300) {
            resolve(JSON.parse(uploadReq.responseText));
          } else {
            let errMsg = "Upload failed";
            try {
              const res = JSON.parse(uploadReq.responseText);
              errMsg = res.error?.message || errMsg;
            } catch (e) {}
            reject(new Error(errMsg));
          }
        });
        uploadReq.addEventListener("error", () =>
          reject(new Error("Network error during upload")),
        );
        uploadReq.addEventListener("abort", () =>
          reject(new Error("Upload aborted")),
        );
      });

      uploadReq.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      );
      uploadReq.send(formData);

      const responseData = await cloudinaryUploadPromise;
      setUploadProgress(100);

      if (onUploadComplete) {
        onUploadComplete(responseData.secure_url);
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
            error && "border-red-300 bg-red-50/50",
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
                isDragging
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-500",
                error && "bg-red-100 text-red-500",
              )}
            >
              <ImageIcon className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>

            <div className="text-xs text-gray-400">
              Supported formats: .jpg, .png, .webp, .gif
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
                <ImageIcon className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 line-clamp-1 break-all">
                  {file.name}
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                  <span>•</span>
                  <span className="uppercase">
                    {file.name.split(".").pop()}
                  </span>
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
                <span
                  className={
                    uploadProgress === 100 ? "text-green-600" : "text-blue-600"
                  }
                >
                  {uploadProgress === 100 ? "Upload Complete!" : "Uploading..."}
                </span>
                <span className="text-gray-600">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              <Progress
                value={uploadProgress}
                className={cn(
                  "h-2",
                  uploadProgress === 100 && "[&>div]:bg-green-500",
                )}
              />
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
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
