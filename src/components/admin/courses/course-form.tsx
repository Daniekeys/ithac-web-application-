"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { CreateCourseData } from "@/types/course.types";
import { useAdminContributors } from "@/hooks/useContributor";
import { useState } from "react";

const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  tagline: z.string().optional(),
  image: z.string().url("Valid image URL is required"),
  thumbnail: z.string().url().optional(),
  introductory_video: z.string().url("Valid video URL is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0, "Amount must be 0 or greater"),
  main_contributor: z.string().min(1, "Main contributor is required"),
  other_contributor: z.array(z.string()),
  language: z.string().min(1, "Language is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  status: z.enum(["draft", "published", "archived"]).optional(),
  visibility: z.enum(["public", "private"]).optional(),
  estimated_duration: z.number().optional(),
  completion_rule: z.string().optional(),
});

interface CourseFormProps {
  defaultValues?: Partial<CreateCourseData>;
  onSubmit: (data: CreateCourseData) => Promise<void> | void;
  loading?: boolean;
}

export function CourseForm({
  defaultValues,
  onSubmit,
  loading,
}: CourseFormProps) {
  const { data: contributorsData } = useAdminContributors(1, 100);
  const contributors = contributorsData?.data || [];

  const [newTag, setNewTag] = useState("");

  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      tagline: "",
      image: "",
      thumbnail: "",
      introductory_video: "",
      description: "",
      amount: 0,
      main_contributor: "",
      other_contributor: [],
      language: "english",
      tags: [],
      level: "beginner" as const,
      status: "draft" as const,
      visibility: "public" as const,
      estimated_duration: 0,
      completion_rule: "all_lessons",
      ...defaultValues,
    },
  });

  const watchedTags = form.watch("tags");
  const watchedOtherContributors = form.watch("other_contributor");

  const addTag = () => {
    if (newTag.trim() && !watchedTags.includes(newTag.trim())) {
      form.setValue("tags", [...watchedTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue(
      "tags",
      watchedTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleFormSubmit = async (data: z.infer<typeof courseSchema>) => {
    console.log("[CourseForm] handleFormSubmit triggered", data);
    try {
      await onSubmit(data as CreateCourseData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter course title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tagline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tagline</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter course tagline" {...field} />
                    </FormControl>
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
                        placeholder="Enter course description"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Level *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visibility</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="estimated_duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Est. Duration (mins)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="e.g. 120"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="completion_rule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completion Rule</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rule" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all_lessons">
                          Complete All Lessons
                        </SelectItem>
                        <SelectItem value="percentage_80">
                          View 80% Content
                        </SelectItem>
                        <SelectItem value="quiz_pass">
                          Pass Final Quiz
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., english, spanish" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (0 for free) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Enter price"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media & Contributors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Image URL *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/thumbnail.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="introductory_video"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intro Video URL *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/video.mp4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="main_contributor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Contributor *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select main contributor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contributors.map((contributor) => (
                          <SelectItem
                            key={contributor._id}
                            value={contributor._id}
                          >
                            {contributor.name} ({contributor.nickname})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="other_contributor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Contributors</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        if (!watchedOtherContributors.includes(value)) {
                          field.onChange([...watchedOtherContributors, value]);
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Add other contributors" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contributors
                          .filter(
                            (c) => !watchedOtherContributors.includes(c._id)
                          )
                          .map((contributor) => (
                            <SelectItem
                              key={contributor._id}
                              value={contributor._id}
                            >
                              {contributor.name} ({contributor.nickname})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {watchedOtherContributors.map((contributorId) => {
                        const contributor = contributors.find(
                          (c) => c._id === contributorId
                        );
                        return (
                          <Badge key={contributorId} variant="secondary">
                            {contributor?.name}
                            <X
                              className="h-3 w-3 ml-1 cursor-pointer"
                              onClick={() =>
                                field.onChange(
                                  watchedOtherContributors.filter(
                                    (id) => id !== contributorId
                                  )
                                )
                              }
                            />
                          </Badge>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button type="button" onClick={addTag}>
                  Add Tag
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {watchedTags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>

              {form.formState.errors.tags && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.tags.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            disabled={loading}
            onClick={() => handleFormSubmit(form.getValues())}
          >
            {loading ? "Saving..." : "Save Course"}
          </Button>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
