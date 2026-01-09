"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { CourseForm } from "@/components/admin/courses/course-form";
import { useCourse, useUpdateCourse } from "@/hooks/useCourse";
import { UpdateCourseData } from "@/types/course.types";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface EditCoursePageProps {
  params: {
    courseId: string;
  };
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
  const router = useRouter();
  
  const { data: courseData, isLoading } = useCourse(params.courseId);
  const updateCourse = useUpdateCourse();



  const handleSubmit = async (data: UpdateCourseData) => {
    const result = await updateCourse.mutateAsync({
      id: params.courseId,
      data,
    });
    if (result.success) {
      router.push("/admin/courses");
    }
  };

  if (isLoading) {
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
        <Card className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  const course = courseData?.data;

  console.log("🔍 Course extraction:", {
    hasCourseData: !!courseData,
    hasData: !!courseData?.data,
    hasCourse: !!course,
    courseDataKeys: courseData ? Object.keys(courseData) : [],
    dataKeys: courseData?.data ? Object.keys(courseData.data) : [],
    courseKeys: course ? Object.keys(course) : [],
    rawCourseData: courseData,
  });

  // Check if course has required fields for editing
  const isValidCourse = course && course.title && course._id;

  if (!isValidCourse) {
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
      <div className="flex items-center gap-4">
        <Link href="/admin/courses">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
          <p className="text-gray-600">Update course details</p>
        </div>
      </div>

      <Card className="p-6">
        <CourseForm
          defaultValues={{
            title: course?.title || "",
            tagline: course?.tagline || "",
            image: course?.image || "",
            thumbnail: course?.thumbnail || "",
            introductory_video: course?.introductory_video || "",
            description: course?.description || "",
            amount: course?.amount || 0,
            main_contributor:
              (typeof course?.main_contributor === "string"
                ? course.main_contributor
                : course?.main_contributor?._id) || "",
            other_contributor:
              course?.other_contributor?.map((c: string | { _id: string }) => 
                typeof c === 'string' ? c : c._id
              ) || [],
            language: course?.language || "english",
            tags: course?.tags || [],
            level: course?.level || "beginner",
          }}
          onSubmit={handleSubmit}
          loading={updateCourse.isPending}
        />
      </Card>
    </div>
  );
}
