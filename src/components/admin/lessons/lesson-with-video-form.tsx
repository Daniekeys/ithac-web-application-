"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { AdvancedVideoUpload } from "@/components/media/advanced-video-upload";
import { CloudinaryUploadResponse } from "@/hooks/useVideoUpload";
import { Badge } from "@/components/ui/badge";
import { Video, X } from "lucide-react";

const lessonFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  videoUrl: z.string().optional(),
  videoPublicId: z.string().optional(),
  duration: z.number().optional(),
  order: z.number().min(1, "Order is required"),
});

type LessonFormData = z.infer<typeof lessonFormSchema>;

interface LessonWithVideoFormProps {
  courseId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function LessonWithVideoForm({
  courseId,
  onSuccess,
  onCancel,
}: LessonWithVideoFormProps) {
  const [uploadedVideo, setUploadedVideo] =
    useState<CloudinaryUploadResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      videoPublicId: "",
      order: 1,
    },
  });

  const handleVideoUploadComplete = (data: CloudinaryUploadResponse) => {
    setUploadedVideo(data);
    form.setValue("videoUrl", data.secure_url);
    form.setValue("videoPublicId", data.public_id);
    form.setValue("duration", data.duration || 0);

    console.log("Video uploaded successfully:", data);
  };

  const handleVideoUploadError = (error: string) => {
    console.error("Video upload failed:", error);
    // Here you could show a toast notification
  };

  const removeVideo = () => {
    setUploadedVideo(null);
    form.setValue("videoUrl", "");
    form.setValue("videoPublicId", "");
    form.setValue("duration", 0);
  };

  const onSubmit = async (data: LessonFormData) => {
    setIsSubmitting(true);

    try {
      // Here you would call your API to create the lesson
      console.log("Creating lesson with data:", {
        ...data,
        courseId,
        videoData: uploadedVideo,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Reset form and video
      form.reset();
      setUploadedVideo(null);

      onSuccess?.();
    } catch (error) {
      console.error("Failed to create lesson:", error);
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Lesson</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Lesson Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lesson Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter lesson title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lesson Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter lesson description"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Video Upload Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Lesson Video</h3>

                {!uploadedVideo ? (
                  <AdvancedVideoUpload
                    onUploadComplete={handleVideoUploadComplete}
                    onUploadError={handleVideoUploadError}
                    maxSize={500} // 500MB for lesson videos
                    title="Upload Lesson Video"
                    description="Upload the main video content for this lesson"
                  />
                ) : (
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Video className="h-5 w-5" />
                          Video Uploaded Successfully
                        </CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={removeVideo}
                          type="button"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Video Preview */}
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <video
                          src={uploadedVideo.secure_url}
                          className="w-full h-full object-contain"
                          controls
                          preload="metadata"
                        />
                      </div>

                      {/* Video Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-700">Filename</p>
                          <p className="text-gray-600 truncate">
                            {uploadedVideo.original_filename || "Untitled"}
                          </p>
                        </div>

                        <div>
                          <p className="font-medium text-gray-700">Duration</p>
                          <p className="text-gray-600">
                            {uploadedVideo.duration
                              ? formatDuration(uploadedVideo.duration)
                              : "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="font-medium text-gray-700">
                            Resolution
                          </p>
                          <p className="text-gray-600">
                            {uploadedVideo.width} × {uploadedVideo.height}
                          </p>
                        </div>

                        <div>
                          <p className="font-medium text-gray-700">Size</p>
                          <p className="text-gray-600">
                            {(uploadedVideo.bytes / (1024 * 1024)).toFixed(1)}{" "}
                            MB
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          Public ID: {uploadedVideo.public_id}
                        </Badge>
                        <Badge variant="outline">
                          Format: {uploadedVideo.format.toUpperCase()}
                        </Badge>
                        {uploadedVideo.frame_rate && (
                          <Badge variant="outline">
                            {uploadedVideo.frame_rate} FPS
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !form.formState.isValid}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? "Creating..." : "Create Lesson"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Debug Info (Remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <Card>
          <CardHeader>
            <CardTitle>Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Form Values:</strong>
                <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(form.getValues(), null, 2)}
                </pre>
              </div>
              {uploadedVideo && (
                <div>
                  <strong>Uploaded Video Data:</strong>
                  <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(uploadedVideo, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
