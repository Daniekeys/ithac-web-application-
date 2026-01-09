"use client";

import React from "react";
import { useParams } from "next/navigation";
import LessonPlayer from "@/components/ui/lesson-player";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function LessonPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const handleLessonComplete = () => {
    // Implement lesson completion logic
    console.log("Lesson completed");
  };

  const handleNextLesson = () => {
    // Implement next lesson navigation
    console.log("Navigate to next lesson");
  };

  const handlePreviousLesson = () => {
    // Implement previous lesson navigation
    console.log("Navigate to previous lesson");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Course */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href={`/dashboard/user/courses/${courseId}`}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Link>
          </Button>
        </div>

        {/* Lesson Player */}
        <LessonPlayer
          courseId={courseId}
          lessonId={lessonId}
          onLessonComplete={handleLessonComplete}
          onNextLesson={handleNextLesson}
          onPreviousLesson={handlePreviousLesson}
          hasNextLesson={true}
          hasPreviousLesson={true}
        />
      </div>
    </div>
  );
}
