"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { ContributorDataTable } from "@/components/admin/contributors/contributor-data-table";
import { ContributorDialog } from "@/components/admin/contributors/contributor-dialog";
import { useAdminContributors, useAdminDeleteContributor } from "@/hooks/useContributor";
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
import { Contributor } from "@/types/contributor.types";

export default function ContributorsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: response, isLoading } = useAdminContributors(page, 10, search);
  const deleteContributor = useAdminDeleteContributor();

  // Debounce search could be added, but relying on controlled input for now
  // For better UX, might want to use useDebounce hook if available, or just pass search directly.

  const contributors = response?.data || [];
  const totalPages = response ? Math.ceil(response.total / response.size) : 1;

  const handleEdit = (contributor: Contributor) => {
    setSelectedContributor(contributor);
    setShowDialog(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteContributor.mutateAsync(deleteId);
        toast({ title: "Success", description: "Contributor removed successfully" });
        setDeleteId(null);
      } catch {
        toast({ 
            title: "Error", 
            description: "Failed to remove contributor", 
            variant: "destructive" 
        });
      }
    }
  };

  const handleOpenCreate = () => {
    setSelectedContributor(null);
    setShowDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Contributors</h1>
                <p className="text-gray-600 mt-1">Manage authors and contributors</p>
            </div>
            <Button onClick={handleOpenCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Add Contributor
            </Button>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>All Contributors</CardTitle>
                <CardDescription>
                    List of all registered contributors and authors.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 flex items-center gap-4">
                     <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input 
                            placeholder="Search by name, email..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                     </div>
                </div>

                <ContributorDataTable 
                    contributors={contributors}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={setDeleteId}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </CardContent>
        </Card>

        <ContributorDialog 
            open={showDialog} 
            onOpenChange={setShowDialog} 
            contributor={selectedContributor} 
        />

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently remove the contributor from the system.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                        Remove
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
