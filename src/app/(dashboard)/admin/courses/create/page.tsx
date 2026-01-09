"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { CourseForm } from "@/components/admin/courses/course-form";
import { useCreateCourse } from "@/hooks/useCourse";
import { CreateCourseData } from "@/types/course.types";
import { useRouter } from "next/navigation";

export default function CreateCoursePage() {
  const router = useRouter();
  const createCourse = useCreateCourse();

  const handleSubmit = async (data: CreateCourseData) => {
    const result = await createCourse.mutateAsync(data);
    if (result.success) {
      router.push("/admin/courses");
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Create Course</h1>
          <p className="text-gray-600">Add a new course to your catalog</p>
        </div>
      </div>

      <Card className="p-6">
        <CourseForm onSubmit={handleSubmit} loading={createCourse.isPending} />
      </Card>
    </div>
  );
}
