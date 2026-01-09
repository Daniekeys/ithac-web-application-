"use client";

import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lesson } from "@/types/course.types";
import {
  MoreHorizontal,
  Edit,
  Trash,
  Play,
  Clock,
  Download,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface LessonDataTableProps {
  lessons: Lesson[];
  isLoading: boolean;
  onEdit: (lesson: Lesson) => void;
  onDelete: (lesson: Lesson) => void;
}

export function LessonDataTable({
  lessons: initialLessons,
  isLoading,
  onEdit,
  onDelete,
  onReorder,
}: LessonDataTableProps & { onReorder?: (lessons: Lesson[]) => void }) {
  const [lessons, setLessons] = React.useState<Lesson[]>(initialLessons);
  const [draggedLesson, setDraggedLesson] = React.useState<Lesson | null>(null);

  React.useEffect(() => {
    setLessons(initialLessons);
  }, [initialLessons]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleDragStart = (lesson: Lesson) => {
    setDraggedLesson(lesson);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (!draggedLesson) return;

    const draggedIndex = lessons.findIndex((l) => l._id === draggedLesson._id);
    if (draggedIndex === index) return;

    const newLessons = [...lessons];
    const item = newLessons.splice(draggedIndex, 1)[0];
    newLessons.splice(index, 0, item);

    setLessons(newLessons);
  };

  const handleDrop = () => {
    if (!draggedLesson) return;
    setDraggedLesson(null);
    if (onReorder) {
      onReorder(lessons);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">
          <Play className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No lessons yet</h3>
          <p className="text-sm">Create your first lesson to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          Course Lessons ({lessons.length})
        </h3>
        {onReorder && (
            <span className="text-xs text-muted-foreground">
                Drag and drop to reorder
            </span>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Lesson</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Resources</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(lessons) ? (
            lessons.map((lesson, index) => (
              <TableRow
                key={lesson._id}
                draggable
                onDragStart={() => handleDragStart(lesson)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={handleDrop}
                className="cursor-move hover:bg-gray-50 transition-colors"
                style={{ opacity: draggedLesson?._id === lesson._id ? 0.5 : 1 }}
              >
                <TableCell>
                  <MoreHorizontal className="h-4 w-4 text-gray-400 rotate-90" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={lesson.thumbnail}
                        alt={lesson.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-4 w-4 text-white bg-black bg-opacity-50 rounded-full p-1" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{lesson.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {lesson.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    #{index + 1}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-sm">
                      {formatDuration(lesson.duration)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {lesson.free ? (
                    <Badge variant="secondary">Free Preview</Badge>
                  ) : (
                    <Badge variant="default">Premium</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Download className="h-3 w-3 text-gray-400" />
                    <span className="text-sm">
                      {lesson.resources?.length || 0}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{lesson.views.length}</span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(lesson)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(lesson)}
                        className="text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                <span className="text-gray-500">No lessons data available</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
