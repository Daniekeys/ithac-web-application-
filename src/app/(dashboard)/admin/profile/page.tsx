"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { User } from "@/types/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Mail, User as UserIcon, Briefcase, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminProfilePage() {
  const { user: storedUser } = useAuthStore();
  const [user, setUser] = useState<User | null>(storedUser);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await authService.getAdminProfile();
        setUser(profile);
      } catch (error) {
        console.error("Failed to fetch admin profile:", error);
        toast({
          title: "Error",
          description: "Failed to fetch profile information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
        <Card>
           <CardContent className="p-6 text-center">
            <p className="text-gray-500">Failed to load profile.</p>
             <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="mt-4"
             >
                Retry
             </Button>
           </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarImage src={user.image || undefined} alt={user.name || "Admin"} />
              <AvatarFallback className="text-2xl">
                {user.name?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold mb-1">{user.name || "Admin User"}</h2>
            <p className="text-gray-500 text-sm mb-4">@{user.nickname || "admin"}</p>
            <Badge variant={user.role === "admin" ? "default" : "secondary"}>
              {user.role?.toUpperCase() || "ADMIN"}
            </Badge>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center text-gray-500 mb-1">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <p className="text-gray-900">{user.email}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center text-gray-500 mb-1">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Profession</span>
                </div>
                <p className="text-gray-900">{user.profession || "N/A"}</p>
              </div>
              
               <div className="space-y-1">
                <div className="flex items-center text-gray-500 mb-1">
                  <Hash className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">User ID</span>
                </div>
                <p className="text-gray-900 font-mono text-sm">{user._id}</p>
              </div>

              <div className="space-y-1">
                 <div className="flex items-center text-gray-500 mb-1">
                  <UserIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Account Status</span>
                </div>
                 <div className="flex gap-2">
                     <Badge variant={!user.disable ? "outline" : "destructive"}>
                        {!user.disable ? "Active" : "Disabled"}
                     </Badge>
                     {user._email && <Badge variant="secondary">Email Verified</Badge>}
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
