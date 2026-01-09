"use client";

import { useAdminUser } from "@/hooks/useUsers";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Mail, User as UserIcon, Calendar, Briefcase } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: response, isLoading, isError } = useAdminUser(id);
  const user = response?.data;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Button variant="ghost" disabled>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
        <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Error loading user details. The user might not exist or there was a server error.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 pl-0 hover:pl-0 hover:bg-transparent"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
        <div className="flex justify-between items-start">
            <div>
                 <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
                 <p className="text-muted-foreground">Detailed view of user information.</p>
            </div>
             <Badge
                variant={user.disable ? "destructive" : "secondary"}
                className="text-base px-4 py-1"
            >
                {user.disable ? "Disabled" : "Active"}
            </Badge>
        </div>
       
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center space-y-4">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{user.name || "No Name"}</h2>
              <p className="text-muted-foreground">
                {user.nickname ? `@${user.nickname}` : "No nickname"}
              </p>
              <Badge variant="outline" className="mt-2 text-xs uppercase tracking-wide">
                {user.role || "User"}
              </Badge>
            </div>
            
            <div className="w-full pt-4 border-t space-y-3 text-left text-sm">
                <div className="flex items-center text-muted-foreground">
                    <UserIcon className="mr-2 h-4 w-4 opacity-70" />
                    <span className="font-medium text-foreground mr-2">Status:</span>
                    {user.disable ? "Disabled" : "Active"}
                </div>
                 <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4 opacity-70" />
                    <span className="font-medium text-foreground mr-2">Joined:</span>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </div>
                 <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4 opacity-70" />
                    <span className="font-medium text-foreground mr-2">Last Updated:</span>
                    {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A"}
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Contact & Details</CardTitle>
            <CardDescription>
                Personal and professional information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                    <div className="flex items-center p-3 bg-muted/50 rounded-md">
                        <Mail className="mr-3 h-4 w-4 text-primary" />
                         <span>{user.email}</span>
                    </div>
                </div>
                
                 <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Profession</label>
                    <div className="flex items-center p-3 bg-muted/50 rounded-md">
                        <Briefcase className="mr-3 h-4 w-4 text-primary" />
                         <span>{user.profession || "Not specified"}</span>
                    </div>
                </div>

                {/* Adding placeholder fields if they assume standard user profile usually has these, 
                    even if the current User type definition is minimal. Adjust based on actual API data. */}
                 {/* 
                 <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <div className="flex items-center p-3 bg-muted/50 rounded-md">
                        <Phone className="mr-3 h-4 w-4 text-primary" />
                         <span>{user.phone || "Not specified"}</span>
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                    <div className="flex items-center p-3 bg-muted/50 rounded-md">
                        <MapPin className="mr-3 h-4 w-4 text-primary" />
                         <span>{user.address || "Not specified"}</span>
                    </div>
                </div> 
                */}
            </div>
            
            {/* Raw JSON Data for Debugging (Optional, hiding for production feel but useful for dev) */}
            {/* 
            <div className="mt-8 pt-6 border-t">
                <h4 className="text-sm font-medium mb-2">Raw Data (Debug)</h4>
                <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-auto text-xs">
                    {JSON.stringify(user, null, 2)}
                </pre>
            </div> 
            */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
