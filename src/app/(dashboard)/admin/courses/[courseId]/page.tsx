"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCourse } from "@/hooks/useCourse";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Course, Lesson } from "@/types/course.types";

interface CourseDetailPageProps {
  params: {
    courseId: string;
  };
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { data: courseData, isLoading } = useCourse(params.courseId);



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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Extract course data based on API response structure
  const course: Course | undefined = courseData?.data;

  // Handle lessons - check multiple possible locations in order of preference
  let lessons: Lesson[] = [];

  // First: Check if lessons are at root level of courseData (as shown in API response)
  if (courseData?.lessons && Array.isArray(courseData.lessons)) {
    lessons = courseData.lessons as Lesson[];
  }

  // Second: Check if lessons are populated objects within course.lessons
  else if (course?.lessons && Array.isArray(course.lessons)) {
    if (course.lessons.length > 0 && typeof course.lessons[0] === "object") {
      lessons = course.lessons as Lesson[];
    }
  }

  // Third: Fallback - check if lessons are at courseData.data.lessons
  else if (
    courseData?.data?.lessons &&
    Array.isArray(courseData.data.lessons) &&
    courseData.data.lessons.length > 0 &&
    typeof courseData.data.lessons[0] === "object"
  ) {
    lessons = courseData.data.lessons as Lesson[];
  }

  // console.log("🔍 Course Detail extraction:", {
  //   hasCourseData: !!courseData,
  //   hasData: !!courseData?.data,
  //   hasCourse: !!course,
  //   hasLessons: !!lessons,
  //   courseDataKeys: courseData ? Object.keys(courseData) : [],
  //   dataKeys: courseData?.data ? Object.keys(courseData.data) : [],
  //   courseKeys: course ? Object.keys(course) : [],
  //   lessonsCount: lessons.length,
  //   courseTitle: course?.title,
  //   courseId: course?._id,
  //   lessonsData: lessons,
  //   courseLessons: course?.lessons,
  //   courseLessonsType: course?.lessons ? typeof course.lessons[0] : "undefined",
  //   rootLessons: courseData?.lessons,
  //   rootLessonsType: courseData?.lessons
  //     ? typeof courseData.lessons[0]
  //     : "undefined",
  //   apiStructure: {
  //     hasSuccess: !!courseData?.success,
  //     hasStatus: !!courseData?.status,
  //     hasDataField: !!courseData?.data,
  //     hasRootLessonsField: !!courseData?.lessons,
  //     hasDataLessonsField: !!courseData?.data?.lessons,
  //     hasCourseLessonsField: !!course?.lessons,
  //   },
  // });

  // Check if course has required fields
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
              {course?.title || "Untitled Course"}
            </h1>
            <p className="text-gray-600">{course?.tagline || ""}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/courses/${course?._id}/edit`}>
            <Button variant="outline">Edit Course</Button>
          </Link>
          <Link href={`/admin/courses/${course?._id}/lessons`}>
            <Button>
              <BookOpen className="h-4 w-4 mr-2" />
              Manage Lessons
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video relative bg-gray-100 rounded-t-lg overflow-hidden">
                {course?.introductory_video ? (
                  <video
                    src={course.introductory_video}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    {course?.image ? (
                      <Image
                        src={course.image}
                        alt={course?.title || "Course image"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400">No image available</span>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-4">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Course Description
                </h3>
                <p className="text-gray-600 mb-6">
                  {course?.description || "No description available"}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {lessons.length}
                    </div>
                    <div className="text-sm text-gray-500">Lessons</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {course?.duration
                        ? `${Math.floor(course.duration / 60)} min`
                        : "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {(course?.amount || 0) === 0
                        ? "Free"
                        : `₦${(course?.amount || 0).toLocaleString()}`}
                    </div>
                    <div className="text-sm text-gray-500">Price</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(course?.tags || []).map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Lessons ({lessons.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {lessons.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2 text-gray-500">
                    No lessons yet
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Start building your course by adding lessons.
                  </p>
                  <Link href={`/admin/courses/${course?._id}/lessons`}>
                    <Button>Add First Lesson</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {lessons
                    .sort((a, b) => a.position - b.position)
                    .slice(0, 5)
                    .map((lesson, index) => (
                      <div
                        key={lesson._id}
                        className="flex items-center space-x-3 p-3 border rounded-lg"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {index + 1}
                          </span>
                        </div>
                        <div className="relative w-16 h-12 rounded overflow-hidden">
                          {lesson.thumbnail ? (
                            <Image
                              src={lesson.thumbnail}
                              alt={lesson.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <Play className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">
                            {lesson.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {lesson.duration
                              ? `${Math.floor(lesson.duration / 60)}:${(
                                  lesson.duration % 60
                                )
                                  .toString()
                                  .padStart(2, "0")}`
                              : "Duration N/A"}
                          </p>
                        </div>
                        <div>
                          {lesson.free ? (
                            <Badge variant="secondary">Free</Badge>
                          ) : (
                            <Badge variant="default">Premium</Badge>
                          )}
                          <Link href={`/admin/courses/${course?._id}/lessons/${lesson._id}`} className="ml-4">
                              <Button variant="ghost" size="sm">View</Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  {lessons.length > 5 && (
                    <div className="text-center pt-4">
                      <Link href={`/admin/courses/${course._id}/lessons`}>
                        <Button variant="outline">
                          View All {lessons.length} Lessons
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {course?.level && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Level
                  </label>
                  <Badge variant="outline" className="ml-2 capitalize">
                    {course.level}
                  </Badge>
                </div>
              )}
              {course?.language && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Language
                  </label>
                  <p className="text-gray-900 capitalize">{course.language}</p>
                </div>
              )}
              {course?.amount !== undefined && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <p className="text-gray-900">
                    {course.amount === 0
                      ? "Free"
                      : `₦${course.amount.toLocaleString()}`}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Created
                </label>
                <p className="text-gray-900">
                  {course?.createdAt
                    ? new Date(course.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Last Updated
                </label>
                <p className="text-gray-900">
                  {course?.updatedAt
                    ? new Date(course.updatedAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              {course?.main_contributor ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={
                          course.main_contributor.image ||
                          "/avatars/default.png"
                        }
                        alt={course.main_contributor.name || "Instructor"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {course.main_contributor.name || "Unknown Instructor"}
                      </h4>
                      <p className="text-sm text-gray-500">
                        @{course.main_contributor.nickname || "instructor"}
                      </p>
                    </div>
                  </div>

                  {course.other_contributor &&
                    course.other_contributor.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">
                          Co-instructors
                        </h5>
                        <div className="space-y-2">
                          {course.other_contributor.map((contributor) => (
                            <div
                              key={contributor._id}
                              className="flex items-center space-x-2"
                            >
                              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                <Image
                                  src={
                                    contributor.image || "/avatars/default.png"
                                  }
                                  alt={contributor.name || "Co-instructor"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-sm">
                                {contributor.name || "Unknown"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">
                    No instructor information available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href={`/admin/courses/${course._id}/edit`}
                className="block"
              >
                <Button variant="outline" className="w-full">
                  Edit Course Details
                </Button>
              </Link>
              <Link
                href={`/admin/courses/${course._id}/lessons`}
                className="block"
              >
                <Button variant="outline" className="w-full">
                  Manage Lessons
                </Button>
              </Link>
              <Button variant="outline" className="w-full" disabled>
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
