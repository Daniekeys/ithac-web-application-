"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useCourse,
  useCourseLessons,
  useDeleteLesson,
  useAdminReorderLessons,
} from "@/hooks/useCourse";
import { LessonDataTable } from "@/components/admin/lessons/lesson-data-table";
import { LessonForm } from "@/components/admin/lessons/lesson-form";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Lesson } from "@/types/course.types";
import { Skeleton } from "@/components/ui/skeleton";

interface LessonsPageProps {
  params: {
    courseId: string;
  };
}

export default function LessonsPage({ params }: LessonsPageProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Lesson | null>(null);

  const { data: courseData, isLoading: courseLoading } = useCourse(params.courseId);
  const { data: lessonsData, isLoading: lessonsLoading } = useCourseLessons(
    params.courseId
  );
  const deleteLesson = useDeleteLesson();
  const reorderLessons = useAdminReorderLessons();

  const course = courseData?.data;
  // @ts-expect-error -- lessons structure might vary from type definition
  const lessons = lessonsData?.lessons || [];

  const handleDelete = async (lesson: Lesson) => {
    setDeleteConfirm(lesson);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      await deleteLesson.mutateAsync({
        courseId: params.courseId,
        lessonId: deleteConfirm._id,
      });
      setDeleteConfirm(null);
    }
  };

  const handleReorder = async (newLessons: Lesson[]) => {
    // Optimistic update could be handled here or in the hook, but for now relying on hook success
    await reorderLessons.mutateAsync({
      courseId: params.courseId,
      lessons: newLessons,
    });
  };

  if (courseLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/courses">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/courses">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Course Not Found
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/courses">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Lessons: {course.title}
            </h1>
            <p className="text-gray-600">Manage course lessons</p>
          </div>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Lesson
        </Button>
      </div>

      {showCreateForm && (
        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Create New Lesson</h2>
          </div>
          <LessonForm
            courseId={params.courseId}
            onSuccess={() => setShowCreateForm(false)}
            onCancel={() => setShowCreateForm(false)}
          />
        </Card>
      )}

      {editingLesson && (
        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Edit Lesson</h2>
          </div>
          <LessonForm
            courseId={params.courseId}
            defaultValues={{
              title: editingLesson.title,
              url: editingLesson.url,
              public_id: editingLesson.public_id,
              asset_id: editingLesson.asset_id,
              thumbnail: editingLesson.thumbnail,
              duration: editingLesson.duration,
              free: editingLesson.free,
              transcript: editingLesson.transcript,
              description: editingLesson.description,
              resources: editingLesson.resources,
              group: editingLesson.group,
              position: editingLesson.position,
            }}
            lessonId={editingLesson._id}
            onSuccess={() => setEditingLesson(null)}
            onCancel={() => setEditingLesson(null)}
          />
        </Card>
      )}

      <Card className="p-6">
        <LessonDataTable
          lessons={lessons}
          isLoading={lessonsLoading}
          onEdit={(lesson) => setEditingLesson(lesson)}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      </Card>

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
        title="Delete Lesson"
        description={`Are you sure you want to delete "${deleteConfirm?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        loading={deleteLesson.isPending}
      />
    </div>
  );
}
