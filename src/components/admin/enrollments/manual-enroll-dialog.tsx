"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminEnrollUser } from "@/hooks/useEnrollment";
import { toast } from "@/hooks/use-toast";

interface ManualEnrollDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManualEnrollDialog({
  open,
  onOpenChange,
}: ManualEnrollDialogProps) {
  const [userId, setUserId] = useState("");
  const [courseId, setCourseId] = useState("");
  const enrollUser = useAdminEnrollUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await enrollUser.mutateAsync({ userId, courseId });
      toast({
        title: "Success",
        description: "User enrolled successfully",
      });
      onOpenChange(false);
      setUserId("");
      setCourseId("");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to enroll user",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manually Enroll User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="courseId">Course ID</Label>
            <Input
              id="courseId"
              placeholder="Enter Course ID"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={enrollUser.isPending}>
              {enrollUser.isPending ? "Enrolling..." : "Enroll User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
