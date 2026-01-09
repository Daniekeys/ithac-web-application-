"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Enrollment } from "@/types/enrollment.types";
import { Course } from "@/types/course.types";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle, Clock } from "lucide-react";

interface UserProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enrollment: Enrollment | null;
}

export function UserProgressDialog({
  open,
  onOpenChange,
  enrollment,
}: UserProgressDialogProps) {
  if (!enrollment) return null;

  const course = typeof enrollment.course === 'string' ? null : enrollment.course as Course;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Progress Details</DialogTitle>
          <DialogDescription>
            Monitoring learner progress for {enrollment.user.name}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">Course</h4>
            <p className="text-base font-semibold">{course?.title}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Completion Status</span>
              <span className="text-blue-600 font-bold">
                {enrollment.progress}%
              </span>
            </div>
            <Progress value={enrollment.progress} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-500 mb-1">
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs font-medium">Status</span>
              </div>
              <p className="text-sm font-semibold capitalize">
                {enrollment.status}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-500 mb-1">
                <BookOpen className="h-4 w-4" />
                <span className="text-xs font-medium">Last Lesson</span>
              </div>
              <p className="text-sm font-semibold truncate">
                {enrollment.lastAccessedLesson || "Not started"}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg flex items-start space-x-3">
            <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                Engagement Insight
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Last active on{" "}
                {enrollment.updatedAt
                  ? new Date(enrollment.updatedAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
