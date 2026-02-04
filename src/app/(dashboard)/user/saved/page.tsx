"use client";

import { useUserSavedCourses, useRemoveFromSaved } from "@/hooks/useUserCourse";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Course } from "@/types/course.types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Heart,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SavedCoursesPage() {
  const { data: savedCoursesData, isLoading, isError } = useUserSavedCourses();
  
  // The response from getSavedCourses usually wraps the list in a `data` property 
  // or return an array directly depending on backend. 
  // Based on service types: SavedCoursesResponse
  // Let's assume response.data is the array of courses or contains it.
  // Checking `user-course.service.ts` import `SavedCoursesResponse`.
  // Usually the structure is { success: boolean, data: Course[] } or similar.
  // We'll treat `savedCoursesData?.data` as `Course[]` for now based on other hooks.

  const courses = savedCoursesData?.data || [];

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Course Card Component
  const { mutate: removeFromSaved } = useRemoveFromSaved(); // Need to import this hook
  
  const CourseCard = ({ course }: { course: Course }) => {
     // We can just add a remove button or reuse the heart toggle 
     // Since this is the saved page, the heart should be filled red.
     // Clicking it should remove it.
     
    const handleRemove = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      removeFromSaved(course._id);
    };

    return (
    <Link href={`/user/courses/${course._id}`}>
      <Card className="group hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col relative">
        <div className="aspect-video relative bg-gray-200 rounded-t-lg overflow-hidden">
          {course.image ? (
            <Image
              src={course.image}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <BookOpen className="h-10 w-10 text-gray-400" />
            </div>
          )}
          {course.level && (
            <Badge
              className={`absolute top-2 left-2 ${getLevelColor(course.level)}`}
              variant="secondary"
            >
              {course.level}
            </Badge>
          )}
          
          <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors text-red-500 hover:text-red-600"
              onClick={handleRemove}
            >
              <Heart className="h-4 w-4 fill-current" />
            </Button>
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {course.description}
            </p>
          </div>

          <div className="mt-auto space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {course.duration || 0}h
              </div>
              <div className="flex items-center">
                <Users className="h-3.5 w-3.5 mr-1" />
                {course.enrolled_count || 0}
              </div>
              {(course.rating || 0) > 0 && (
                <div className="flex items-center">
                  <Star className="h-3.5 w-3.5 mr-1 fill-yellow-400 text-yellow-400" />
                  {(course.rating || 0).toFixed(1)}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <span className="text-lg font-bold text-blue-600">
                {formatPrice(course.amount || 0)}
              </span>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full group-hover:bg-blue-100 transition-colors">
                View Details
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
    );
  };

  const CourseSkeleton = () => (
    <Card className="h-full">
      <Skeleton className="aspect-video w-full rounded-t-lg" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </CardContent>
    </Card>
  );

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <BookOpen className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-500 max-w-sm mb-6">
          We couldn't load your saved courses. Please try again later.
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 px-4 lg:px-8 pt-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Courses</h1>
          <p className="text-gray-600">
            Continue where you left off or start a new learning journey
          </p>
        </div>
        <Link href="/user/courses">
           <Button variant="outline">
             Browse More Courses <ArrowRight className="ml-2 h-4 w-4" />
           </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <CourseSkeleton key={i} />)
          : courses.map((course: Course) => (
              <CourseCard key={course._id} course={course} />
            ))}
      </div>

      {!isLoading && courses.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <div className="bg-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            No saved courses yet
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-6">
            When you find a course you're interested in, tap the heart icon to save it here for later.
          </p>
          <Link href="/user/courses">
            <Button>Explore Courses</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
