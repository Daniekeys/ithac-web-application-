"use client";

import { useState } from "react";
import { useUserCourses, useAddToSaved, useRemoveFromSaved, useUserSavedCourses } from "@/hooks/useUserCourse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Course } from "@/types/course.types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  BookOpen,
  Clock,
  Users,
  Star,
  Filter,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CoursesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data: coursesData, isLoading, isError } = useUserCourses(page, 12);

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
  const CourseCard = ({ course }: { course: Course }) => {
    const addToSaved = useAddToSaved();
    const removeFromSaved = useRemoveFromSaved();
    const { data: savedCoursesData } = useUserSavedCourses();
    
    // Check if course is already saved
    // Assuming savedCoursesData.data is an array of courses
    const isSaved = savedCoursesData?.data?.some(
      (savedCourse: Course) => savedCourse._id === course._id
    );

    const handleToggleSave = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (isSaved) {
        removeFromSaved.mutate(course._id);
      } else {
        addToSaved.mutate(course._id);
      }
    };

    const isPending = addToSaved.isPending || removeFromSaved.isPending;

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
            
            {/* Level Badge */}
            {course.level && (
              <Badge
                className={`absolute top-2 left-2 ${getLevelColor(course.level)}`}
                variant="secondary"
              >
                {course.level}
              </Badge>
            )}

            {/* Save Button */}
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors 
                ${isSaved ? "text-red-500" : "text-gray-500 hover:text-red-500"}`}
              onClick={handleToggleSave}
              disabled={isPending}
            >
              <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
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

  return (
    <div className="space-y-8 pb-8 px-4 lg:px-8 pt-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Courses</h1>
          <p className="text-gray-600">
            Explore our wide range of courses and start learning today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search courses..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isError ? (
        <div className="text-center py-12 bg-red-50 rounded-lg">
          <p className="text-red-600 mb-4">
            Failed to load courses. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <CourseSkeleton key={i} />
              ))
            : coursesData?.data?.map((course: Course) => (
                <CourseCard key={course._id} course={course} />
              ))}
        </div>
      )}

      {!isLoading && coursesData?.data?.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            No courses found
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto mt-2">
            Try adjusting your search or check back later for new content.
          </p>
        </div>
      )}

      {/* Pagination (Simplified) */}
      {!isLoading && (coursesData?.total || 0) > 12 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm font-medium text-gray-600">
            Page {page}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={(coursesData?.data?.length || 0) < 12} // Simple check, ideally use total pages
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
