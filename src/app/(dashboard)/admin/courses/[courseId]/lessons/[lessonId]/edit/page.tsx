"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { courseService } from "@/services/course.service";
import { Lesson } from "@/types/course.types";
import { useToast } from "@/hooks/use-toast";
import { LessonForm } from "@/components/admin/lessons/lesson-form";

interface LessonEditPageProps {
  params: {
    courseId: string;
    lessonId: string;
  };
}

export default function LessonEditPage({ params }: LessonEditPageProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setIsLoading(true);
        const response = await courseService.adminGetLessonById(
          params.courseId,
          params.lessonId
        );
        if (response.success && response.data) {
          setLesson(response.data);
        } else {
          toast({
            title: "Error",
            description: response.error || "Failed to fetch lesson details",
            variant: "destructive",
          });
        }
      } catch (err: any) {
        console.error("Error fetching lesson:", err);
        toast({
          title: "Error",
          description: "An error occurred while fetching lesson details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (params.courseId && params.lessonId) {
      fetchLesson();
    }
  }, [params.courseId, params.lessonId, toast]);

  const handleSuccess = () => {
    toast({
      title: "Success",
      description: "Lesson updated successfully",
    });
    router.push(`/admin/courses/${params.courseId}/lessons/${params.lessonId}`);
    router.refresh();
  };

  const handleCancel = () => {
    router.push(`/admin/courses/${params.courseId}/lessons/${params.lessonId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" disabled>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!lesson) {
    // Error loading lesson is handled by toast and keeping component in loading/empty state essentially,
    // or we could show a not found message.
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/admin/courses/${params.courseId}/lessons/${params.lessonId}`}>
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Lesson
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Lesson Not Found</h1>
            </div>
        </div>
    );
  }

  // Map Lesson to CreateLessonData for defaultValues
  // Note: timestamps and _id are not part of CreateLessonData, so we stick to the fields LessonForm expects via spread or explicit mapping
  const defaultValues = {
    title: lesson.title,
    url: lesson.url,
    public_id: lesson.public_id,
    asset_id: lesson.asset_id,
    thumbnail: lesson.thumbnail,
    duration: lesson.duration,
    free: lesson.free,
    transcript: lesson.transcript,
    description: lesson.description,
    resources: lesson.resources,
    group: lesson.group,
    position: lesson.position,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/admin/courses/${params.courseId}/lessons/${params.lessonId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lesson
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Lesson: {lesson.title}
            </h1>
          </div>
        </div>
      </div>

      <LessonForm
        courseId={params.courseId}
        lessonId={params.lessonId}
        defaultValues={defaultValues}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
