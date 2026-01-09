"use client";

import { useState } from "react";
import { AdvancedVideoUpload } from "@/components/media/advanced-video-upload";
import { VideoUpload } from "@/components/media/video-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CloudinaryUploadResponse } from "@/hooks/useVideoUpload";
import { CheckCircle, Video, ExternalLink } from "lucide-react";

export default function VideoUploadDemo() {
  const [uploadedVideos, setUploadedVideos] = useState<
    CloudinaryUploadResponse[]
  >([]);
  const [showAdvanced, setShowAdvanced] = useState(true);

  const handleUploadComplete = (response: CloudinaryUploadResponse) => {
    setUploadedVideos((prev) => [response, ...prev]);
    console.log("Upload complete:", response);
  };

  const handleUploadError = (error: string) => {
    console.error("Upload error:", error);
    // You could show a toast notification here
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds: number) => {
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

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Video Upload Components Demo
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Test our custom video upload components with Cloudinary integration,
          engaging preloaders, and comprehensive upload progress tracking.
        </p>
      </div>

      {/* Component Toggle */}
      <div className="flex justify-center gap-4">
        <Button
          variant={showAdvanced ? "default" : "outline"}
          onClick={() => setShowAdvanced(true)}
        >
          Advanced Upload
        </Button>
        <Button
          variant={!showAdvanced ? "default" : "outline"}
          onClick={() => setShowAdvanced(false)}
        >
          Basic Upload
        </Button>
      </div>

      {/* Demo Links */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => window.open("/lesson-video-demo", "_blank")}
        >
          View Lesson Integration Demo
        </Button>
        <Button
          variant="outline"
          onClick={() => window.open("/video-upload-methods-demo", "_blank")}
        >
          View Response Methods Demo
        </Button>
      </div>

      {/* Upload Component */}
      <div className="max-w-4xl mx-auto">
        {showAdvanced ? (
          <AdvancedVideoUpload
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            maxSize={100}
            acceptedFormats={[".mp4", ".mov", ".avi", ".mkv", ".webm"]}
            title="Advanced Video Upload"
            description="Upload videos with detailed progress tracking and engaging animations"
          />
        ) : (
          <VideoUpload
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            maxSize={100}
            acceptedFormats={[".mp4", ".mov", ".avi", ".mkv", ".webm"]}
          />
        )}
      </div>

      {/* Upload History */}
      {uploadedVideos.length > 0 && (
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Successfully Uploaded Videos
          </h2>

          <div className="grid gap-4">
            {uploadedVideos.map((video, index) => (
              <Card key={video.public_id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      <span className="truncate">
                        {video.original_filename || "Untitled Video"}
                      </span>
                    </div>
                    <Badge variant="secondary">#{index + 1}</Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Video Preview */}
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      src={video.secure_url}
                      className="w-full h-full object-contain"
                      controls
                      preload="metadata"
                    />
                  </div>

                  {/* Video Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">Public ID</p>
                      <p className="text-gray-600 font-mono text-xs truncate">
                        {video.public_id}
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-gray-700">Format</p>
                      <p className="text-gray-600 uppercase">{video.format}</p>
                    </div>

                    <div>
                      <p className="font-medium text-gray-700">Size</p>
                      <p className="text-gray-600">
                        {formatBytes(video.bytes)}
                      </p>
                    </div>

                    {video.duration && (
                      <div>
                        <p className="font-medium text-gray-700">Duration</p>
                        <p className="text-gray-600">
                          {formatDuration(video.duration)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Technical Details */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm bg-gray-50 rounded-lg p-3">
                    <div>
                      <p className="font-medium text-gray-700">Dimensions</p>
                      <p className="text-gray-600">
                        {video.width} × {video.height}
                      </p>
                    </div>

                    {video.frame_rate && (
                      <div>
                        <p className="font-medium text-gray-700">Frame Rate</p>
                        <p className="text-gray-600">{video.frame_rate} fps</p>
                      </div>
                    )}

                    {video.bit_rate && (
                      <div>
                        <p className="font-medium text-gray-700">Bitrate</p>
                        <p className="text-gray-600">
                          {Math.round(video.bit_rate / 1000)} kbps
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Links */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(video.secure_url, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Original
                    </Button>

                    {video.playback_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(video.playback_url, "_blank")
                        }
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Streaming URL
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(video.public_id);
                      }}
                    >
                      Copy Public ID
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Implementation Guide */}
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Implementation Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Environment Variables</h3>
              <p className="text-sm text-gray-600">
                Set up your Cloudinary credentials in your environment:
              </p>
              <div className="bg-gray-100 rounded-lg p-3 font-mono text-sm">
                <div>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name</div>
                <div>
                  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Basic Usage</h3>
              <div className="bg-gray-100 rounded-lg p-3 font-mono text-sm">
                {`import { AdvancedVideoUpload } from '@/components/media/advanced-video-upload';

<AdvancedVideoUpload
  onUploadComplete={(data) => console.log(data)}
  onUploadError={(error) => console.error(error)}
  maxSize={100}
  acceptedFormats={['.mp4', '.mov', '.avi']}
/>`}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
