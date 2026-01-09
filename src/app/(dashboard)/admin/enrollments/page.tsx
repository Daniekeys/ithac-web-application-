"use client";

import React, { useState } from "react";
import {
  useAdminEnrollments,
  useAdminRemoveEnrollment,
  useAdminUpdateEnrollment,
} from "@/hooks/useEnrollment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Filter, Download } from "lucide-react";
import { EnrollmentDataTable } from "@/components/admin/enrollments/enrollment-data-table";
import { UserProgressDialog } from "@/components/admin/enrollments/user-progress-dialog";
import { Enrollment } from "@/types/enrollment.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

import { ManualEnrollDialog } from "@/components/admin/enrollments/manual-enroll-dialog";

export default function AdminEnrollmentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [enrollmentToRemove, setEnrollmentToRemove] = useState<string | null>(
    null
  );

  const { data: enrollmentsData, isLoading } = useAdminEnrollments(
    page,
    10,
    search
  );
  const removeEnrollment = useAdminRemoveEnrollment();
  const updateEnrollment = useAdminUpdateEnrollment();

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateEnrollment.mutateAsync({ id, data: { status: status as any } });
      toast({
        title: "Status Updated",
        description: `Enrollment marked as ${status}.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const handleRemove = async () => {
    if (enrollmentToRemove) {
      try {
        await removeEnrollment.mutateAsync(enrollmentToRemove);
        toast({
          title: "Enrollment Removed",
          description: "User has been removed from the course.",
        });
        setEnrollmentToRemove(null);
      } catch {
        toast({
          title: "Error",
          description: "Failed to remove enrollment.",
          variant: "destructive",
        });
      }
    }
  };

  const handleViewProgress = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowProgressDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Enrollment Management
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor and manage learner enrollments
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => setShowEnrollDialog(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Enroll User
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search by user or course..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter Status
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enrollments Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <EnrollmentDataTable
              enrollments={enrollmentsData?.data || []}
              isLoading={isLoading}
              onRemove={setEnrollmentToRemove}
              onViewProgress={handleViewProgress}
              onUpdateStatus={handleUpdateStatus}
              page={page}
              totalPages={
                enrollmentsData ? Math.ceil(enrollmentsData.total / 10) : 1
              }
              onPageChange={setPage}
            />
          </CardContent>
        </Card>

        {/* Modals */}
        <ManualEnrollDialog
          open={showEnrollDialog}
          onOpenChange={setShowEnrollDialog}
        />
        <UserProgressDialog
          open={showProgressDialog}
          onOpenChange={setShowProgressDialog}
          enrollment={selectedEnrollment}
        />

        <AlertDialog
          open={!!enrollmentToRemove}
          onOpenChange={() => setEnrollmentToRemove(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove User from Course?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will revoke the user's access to the course. Their
                progress data may be retained or archived depending on system
                settings.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRemove}
                className="bg-red-600 hover:bg-red-700"
              >
                Remove User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
