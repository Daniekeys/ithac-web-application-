"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Play, FileText, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { courseService } from "@/services/course.service";
import { Lesson } from "@/types/course.types";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

interface LessonDetailsPageProps {
  params: {
    courseId: string;
    lessonId: string;
  };
}

export default function LessonDetailsPage({ params }: LessonDetailsPageProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
          setError(response.error || "Failed to fetch lesson details");
          toast({
            title: "Error",
            description: response.error || "Failed to fetch lesson details",
            variant: "destructive",
          });
        }
      } catch (err: any) {
        console.error("Error fetching lesson:", err);
        setError(err.message || "An error occurred while fetching lesson details");
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
  }, [params.courseId, params.lessonId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" disabled>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lessons
            </Button>
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-96 w-full" />
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

  if (error || !lesson) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/admin/courses/${params.courseId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Error</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error || "Lesson not found"}</p>
              <Link href={`/admin/courses/${params.courseId}`}>
                <Button>Return to Course</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/admin/courses/${params.courseId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {lesson.title}
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
            <Link href={`/admin/courses/${params.courseId}/lessons/${params.lessonId}/edit`}>
             <Button>Edit Lesson</Button>
            </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content: Video and Description */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-0 overflow-hidden rounded-lg">
              <div className="aspect-video relative bg-slate-100">
                {lesson.url ? (
                  <video
                    src={lesson.url}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : lesson.thumbnail ? (
                   <div className="relative w-full h-full">
                      <Image 
                        src={lesson.thumbnail} 
                        alt={lesson.title} 
                        fill 
                        className="object-cover" 
                      />
                       <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <p className="text-white font-medium bg-black/50 px-3 py-1 rounded">No Video Available</p>
                       </div>
                   </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Play className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-500">No content media</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <div className="prose max-w-none">
                    <p className="text-gray-600 whitespace-pre-wrap">{lesson.description || "No description provided."}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Details and Meta */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Status</span>
                <Badge variant={lesson.free ? "secondary" : "default"}>
                  {lesson.free ? "Free Preview" : "Premium"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Duration</span>
                  <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="text-sm">
                          {lesson.duration ? `${Math.floor(lesson.duration / 60)}:${(lesson.duration % 60).toString().padStart(2, '0')}` : "N/A"}
                      </span>
                  </div>
              </div>

               <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Position</span>
                   <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{lesson.position}</span>
              </div>

              <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                       <Calendar className="h-4 w-4" />
                       <span className="font-medium">Created</span>
                  </div>
                  <p className="text-sm pl-6">
                      {lesson.createdAt ? new Date(lesson.createdAt).toLocaleDateString() : "N/A"}
                  </p>
              </div>

               <div className="pt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                       <Calendar className="h-4 w-4" />
                       <span className="font-medium">Last Updated</span>
                  </div>
                  <p className="text-sm pl-6">
                      {lesson.updatedAt ? new Date(lesson.updatedAt).toLocaleDateString() : "N/A"}
                  </p>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
