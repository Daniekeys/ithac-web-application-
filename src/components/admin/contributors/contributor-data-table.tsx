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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, Edit, Trash2, Mail } from "lucide-react";
import { Contributor } from "@/types/contributor.types";
// import { Pagination } from "@/components/ui/pagination"; // Removing non-existent component import
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ContributorDataTableProps {
  contributors: Contributor[];
  isLoading: boolean;
  onEdit: (contributor: Contributor) => void;
  onDelete: (id: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ContributorDataTable({
  contributors,
  isLoading,
  onEdit,
  onDelete,
  page,
  totalPages,
  onPageChange,
}: ContributorDataTableProps) {
  if (isLoading) {
    return <div className="p-8 text-center">Loading contributors...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contributor</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Profession</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contributors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No contributors found.
                </TableCell>
              </TableRow>
            ) : (
              contributors.map((contributor) => (
                <TableRow key={contributor._id}>
                  <TableCell className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                        {contributor.image ? (
                            <img src={contributor.image} alt={contributor.name} className="h-full w-full object-cover" />
                        ) : (
                             <span className="text-gray-500 font-medium">{contributor.name.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium">{contributor.name}</span>
                        {contributor.nickname && <span className="text-xs text-muted-foreground">@{contributor.nickname}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                        <span>{contributor.email}</span>
                        <span className="text-xs text-muted-foreground">{contributor.phone || "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{contributor.profession || "-"}</TableCell>
                   <TableCell>
                    {new Date(contributor.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(contributor)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => window.location.href = `mailto:${contributor.email}`}>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDelete(contributor._id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <div className="text-sm">
             Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
