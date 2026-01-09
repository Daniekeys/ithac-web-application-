"use client";

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
import { Course } from "@/types/course.types";
import { MoreHorizontal, Edit, Trash, Eye } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface CourseDataTableProps {
  courses: Course[];
  isLoading: boolean;
  onDelete: (course: Course) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function CourseDataTable({
  courses,
  isLoading,
  onDelete,
  page,
  totalPages,
  onPageChange,
}: CourseDataTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Lessons</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course._id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{course.title}</div>
                    <div className="text-sm text-gray-500">
                      {course.tagline}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src={course.main_contributor.image}
                      alt={course.main_contributor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm">
                    {course.main_contributor.name}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    course.level === "beginner"
                      ? "secondary"
                      : course.level === "intermediate"
                      ? "default"
                      : "destructive"
                  }
                  className="capitalize"
                >
                  {course.level}
                </Badge>
              </TableCell>
              <TableCell>
                {course.amount === 0 ? (
                  <Badge variant="outline">Free</Badge>
                ) : (
                  <span>₦{course.amount.toLocaleString()}</span>
                )}
              </TableCell>
              <TableCell>
                {Array.isArray(course.lessons) ? course.lessons.length : 0}
              </TableCell>
              <TableCell>
                {course.duration
                  ? `${Math.floor(course.duration / 60)} min`
                  : "—"}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">Published</Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/admin/courses/${course._id}`}>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`/admin/courses/${course._id}/edit`}>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`/admin/courses/${course._id}/lessons`}>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Manage Lessons
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      onClick={() => onDelete(course)}
                      className="text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
