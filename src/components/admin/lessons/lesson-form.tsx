"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Video } from "lucide-react";
import { CreateLessonData } from "@/types/course.types";
import { useCreateLesson, useUpdateLesson } from "@/hooks/useCourse";
import { useState } from "react";
import {
  AdvancedVideoUpload,
  CloudinaryUploadResponse,
} from "@/components/media";

const lessonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Valid video URL is required"),
  public_id: z.string().min(1, "Cloudinary public ID is required"),
  asset_id: z.string().min(1, "Cloudinary asset ID is required"),
  thumbnail: z.string().url("Valid thumbnail URL is required"),
  duration: z.number().min(1, "Duration must be greater than 0"),
  free: z.boolean(),
  transcript: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  resources: z
    .array(
      z.object({
        filename: z.string().min(1, "Filename is required"),
        path: z.string().url("Valid resource URL is required"),
      })
    )
    .optional(),
  group: z.string().optional(),
  position: z.number().optional(),
});

interface LessonFormProps {
  courseId: string;
  defaultValues?: Partial<CreateLessonData>;
  lessonId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function LessonForm({
  courseId,
  defaultValues,
  lessonId,
  onSuccess,
  onCancel,
}: LessonFormProps) {
  const [newResource, setNewResource] = useState({ filename: "", path: "" });
  const [uploadedVideo, setUploadedVideo] =
    useState<CloudinaryUploadResponse | null>(null);

  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();

  const form = useForm({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      url: "",
      public_id: "",
      asset_id: "",
      thumbnail: "",
      duration: 0,
      free: false,
      transcript: "",
      description: "",
      resources: [],
      group: "",
      position: 0,
      ...defaultValues,
    },
  });

  const watchedResources = form.watch("resources");

  const addResource = () => {
    if (newResource.filename.trim() && newResource.path.trim()) {
      const currentResources = watchedResources || [];
      form.setValue("resources", [
        ...currentResources,
        {
          filename: newResource.filename.trim(),
          path: newResource.path.trim(),
        },
      ]);
      setNewResource({ filename: "", path: "" });
    }
  };

  const removeResource = (index: number) => {
    const currentResources = watchedResources || [];
    form.setValue(
      "resources",
      currentResources.filter((_, i) => i !== index)
    );
  };

  // Handle video upload completion
  const handleVideoUpload = (data: CloudinaryUploadResponse) => {
    setUploadedVideo(data);

    // Auto-populate form fields from Cloudinary response
    form.setValue("url", data.secure_url);
    form.setValue("public_id", data.public_id);
    form.setValue("asset_id", data.asset_id);

    // Set duration if available
    if (data.duration) {
      form.setValue("duration", Math.round(data.duration));
    }

    // Generate thumbnail URL from Cloudinary
    const thumbnailUrl = data.secure_url.replace(
      /\.(mp4|mov|avi|mkv|webm)$/,
      ".jpg"
    );
    form.setValue("thumbnail", thumbnailUrl);

    // Auto-generate title from original filename if not set
    if (data.original_filename && !form.getValues("title")) {
      const cleanTitle = data.original_filename
        .replace(/\.[^/.]+$/, "") // Remove file extension
        .replace(/[_-]/g, " ") // Replace underscores and dashes with spaces
        .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize first letter of each word
      form.setValue("title", cleanTitle);
    }
  };

  const handleVideoUploadError = (error: string) => {
    console.error("Video upload failed:", error);
    // You could show a toast notification here
  };

  const removeUploadedVideo = () => {
    setUploadedVideo(null);
    form.setValue("url", "");
    form.setValue("public_id", "");
    form.setValue("asset_id", "");
    form.setValue("thumbnail", "");
    form.setValue("duration", 0);
  };

  const onSubmit = async (data: CreateLessonData) => {
    try {
      if (lessonId) {
        await updateLesson.mutateAsync({
          courseId,
          lessonId,
          lessonData: data,
        });
      } else {
        await createLesson.mutateAsync({
          courseId,
          lessonData: data,
        });
      }
      onSuccess();
    } catch (error) {
       console.error(error);
      // Error handling is done in the mutation
    }
  };

  const isLoading = createLesson.isPending || updateLesson.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter lesson title"
                        {...field}
                        className={
                          uploadedVideo && uploadedVideo.original_filename
                            ? "bg-green-50"
                            : ""
                        }
                      />
                    </FormControl>
                    {uploadedVideo &&
                      uploadedVideo.original_filename &&
                      field.value && (
                        <FormDescription className="text-green-600">
                          ✓ Auto-generated from filename:{" "}
                          {uploadedVideo.original_filename}
                        </FormDescription>
                      )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter lesson description"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (seconds) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder={
                          uploadedVideo
                            ? "Auto-detected from video"
                            : "Duration in seconds"
                        }
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className={uploadedVideo ? "bg-green-50" : ""}
                      />
                    </FormControl>
                    {uploadedVideo && (
                      <FormDescription className="text-green-600">
                        ✓ Auto-detected:{" "}
                        {Math.floor(uploadedVideo.duration! / 60)}:
                        {String(
                          Math.floor(uploadedVideo.duration! % 60)
                        ).padStart(2, "0")}{" "}
                        (mm:ss)
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Lesson position"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Order of this lesson in the course (0 = first)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="group"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Optional group identifier"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      UUID for grouping lessons together
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="free"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Free Preview</FormLabel>
                      <FormDescription>
                        Allow users to watch this lesson for free
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Video Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!uploadedVideo ? (
                <AdvancedVideoUpload
                  onUploadComplete={handleVideoUpload}
                  onUploadError={handleVideoUploadError}
                  maxSize={500} // 500MB for lesson videos
                  title="Upload Lesson Video"
                  description="Upload the main video content for this lesson. Video metadata will auto-populate the form fields below."
                  acceptedFormats={[".mp4", ".mov", ".avi", ".mkv", ".webm"]}
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Video className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800">
                          Video uploaded successfully!
                        </p>
                        <p className="text-sm text-green-600">
                          {uploadedVideo.original_filename || "Video file"} •{" "}
                          {(uploadedVideo.bytes / (1024 * 1024)).toFixed(1)} MB
                          {uploadedVideo.duration &&
                            ` • ${Math.floor(
                              uploadedVideo.duration / 60
                            )}:${String(
                              Math.floor(uploadedVideo.duration % 60)
                            ).padStart(2, "0")}`}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeUploadedVideo}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>

                  {/* Video Preview */}
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      src={uploadedVideo.secure_url}
                      className="w-full h-full object-contain"
                      controls
                      preload="metadata"
                    />
                  </div>

                  {/* Auto-populated fields info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800 font-medium mb-2">
                      ✨ Auto-populated fields:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                      <div>• Video URL</div>
                      <div>
                        • Duration (
                        {uploadedVideo.duration
                          ? Math.round(uploadedVideo.duration)
                          : 0}
                        s)
                      </div>
                      <div>• Public ID</div>
                      <div>• Thumbnail URL</div>
                      <div>• Asset ID</div>
                      {uploadedVideo.original_filename && (
                        <div>• Title (from filename)</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Video Information</CardTitle>
              <p className="text-sm text-muted-foreground">
                {uploadedVideo
                  ? "Review and modify the auto-populated video information"
                  : "Upload a video above to auto-populate these fields"}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Upload a video to auto-populate this field"
                        {...field}
                        readOnly={!!uploadedVideo}
                        className={uploadedVideo ? "bg-gray-50" : ""}
                      />
                    </FormControl>
                    {uploadedVideo && (
                      <FormDescription className="text-green-600">
                        ✓ Auto-populated from video upload
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail URL *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Upload a video to auto-generate thumbnail URL"
                        {...field}
                        readOnly={!!uploadedVideo}
                        className={uploadedVideo ? "bg-gray-50" : ""}
                      />
                    </FormControl>
                    {uploadedVideo && (
                      <FormDescription className="text-green-600">
                        ✓ Auto-generated from video upload
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="public_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cloudinary Public ID *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Upload a video to auto-populate this field"
                        {...field}
                        readOnly={!!uploadedVideo}
                        className={uploadedVideo ? "bg-gray-50 font-mono" : ""}
                      />
                    </FormControl>
                    <FormDescription>
                      {uploadedVideo
                        ? "✓ Auto-populated from Cloudinary upload response"
                        : "Public ID from Cloudinary upload response"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="asset_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cloudinary Asset ID *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Upload a video to auto-populate this field"
                        {...field}
                        readOnly={!!uploadedVideo}
                        className={uploadedVideo ? "bg-gray-50 font-mono" : ""}
                      />
                    </FormControl>
                    <FormDescription>
                      {uploadedVideo
                        ? "✓ Auto-populated from Cloudinary upload response"
                        : "Asset ID from Cloudinary upload response"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transcript"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transcript</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Optional lesson transcript"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  placeholder="Resource filename"
                  value={newResource.filename}
                  onChange={(e) =>
                    setNewResource({ ...newResource, filename: e.target.value })
                  }
                />
                <Input
                  placeholder="Resource URL"
                  value={newResource.path}
                  onChange={(e) =>
                    setNewResource({ ...newResource, path: e.target.value })
                  }
                />
                <Button type="button" onClick={addResource} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Resource
                </Button>
              </div>

              {watchedResources && watchedResources.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Added Resources:</h4>
                  <div className="space-y-2">
                    {watchedResources.map((resource, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{resource.filename}</p>
                          <p className="text-sm text-gray-500">
                            {resource.path}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeResource(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : lessonId
              ? "Update Lesson"
              : "Create Lesson"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
