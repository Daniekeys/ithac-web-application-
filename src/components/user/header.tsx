"use client";

import { useAuthStore } from "@/store/auth.store";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export function UserHeader() {
  const { user } = useAuthStore();
  const { logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b h-16 flex items-center justify-end px-6 sticky top-0 z-40">
      <div className="flex items-center space-x-4">
        {/*
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/user/cart">
            <ShoppingCart className="h-5 w-5" />
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/user/saved">
             <Bookmark className="h-5 w-5" />
          </Link>
        </Button>
        */}
        <div className="flex items-center space-x-2">
           <User className="h-5 w-5 text-gray-400" />
           <span className="text-sm font-medium text-gray-700">
             {user?.name || user?.email}
           </span>
         </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}
