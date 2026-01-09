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
import { Enrollment } from "@/types/enrollment.types";
import { MoreHorizontal, Trash, BarChart, CheckCircle, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
// import { format } from "date-fns";
import { Course } from "@/types/course.types";

interface EnrollmentDataTableProps {
  enrollments: Enrollment[];
  isLoading: boolean;
  onRemove: (id: string) => void;
  onViewProgress: (enrollment: Enrollment) => void;
  onUpdateStatus: (id: string, status: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function EnrollmentDataTable({
  enrollments,
  isLoading,
  onRemove,
  onViewProgress,
  onUpdateStatus,
  page,
  totalPages,
  onPageChange,
}: EnrollmentDataTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
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
            <TableHead>User</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Enrolled Date</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrollments.map((enrollment) => {
            const course = typeof enrollment.course === 'string' ? null : enrollment.course as Course;
            return (
              <TableRow key={enrollment._id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                      {enrollment.user.avatar ? (
                        <Image
                          src={enrollment.user.avatar}
                          alt={enrollment.user.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full text-xs font-bold text-gray-500">
                          {enrollment.user.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{enrollment.user.name}</div>
                      <div className="text-xs text-gray-500">
                        {enrollment.user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium truncate max-w-[200px]">
                    {course?.title || "Unknown Course"}
                  </div>
                </TableCell>
                <TableCell>
                  {enrollment.enrolledAt
                    ? new Date(enrollment.enrolledAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">
                      {enrollment.progress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      enrollment.status === "completed"
                        ? "default"
                        : enrollment.status === "active"
                        ? "secondary"
                        : "destructive"
                    }
                    className="capitalize"
                  >
                    {enrollment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onViewProgress(enrollment)}
                      >
                        <BarChart className="mr-2 h-4 w-4" />
                        View Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onUpdateStatus(enrollment._id, "completed")
                        }
                      >
                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                        Mark Complete
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(enrollment._id, "active")}
                      >
                        <XCircle className="mr-2 h-4 w-4 text-orange-600" />
                        Revoke Completion
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onRemove(enrollment._id)}
                        className="text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
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
