"use client";

import { useEffect, useState } from "react";
import { UserSidebar } from "@/components/user/sidebar";
// import { UserHeader } from "@/components/user/header"; 
// Note: User Dashboard page has its own header internal logic for now, or we can use generic header. 
// Given the mockup showing sidebar, let's wrap children.

import { useUserDashboardStore } from "@/store/user-dashboard.store";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const { sidebarCollapsed, toggleSidebar } = useUserDashboardStore();
  const { isAuthenticated, token } = useAuthStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const userType = sessionStorage.getItem("userType");
      
      // If user is admin, they shouldn't be here -> redirect to admin
      if (userType === 'admin') {
         router.push("/admin");
         return;
      }

      if (!isAuthenticated || !token) {
        router.push("/login");
      }
    }
  }, [isClient, isAuthenticated, token, router]);

  if (!isClient) {
    return null; 
  }

  // The User Dashboard page currently has its own header. 
  // We can either remove the header from page.tsx and put it here, 
  // OR just wrap the page content with sidenav padding.
  // For now, I will NOT include a separate Header component here to avoid double headers, 
  // as the page.tsx handles "Welcome back {user}" which requires user data.
  // However, the SIDEBAR needs to slide the main content.
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UserSidebar />
      <main
        className={cn(
          "flex-1 transition-all duration-300 w-full overflow-x-hidden",
          // On mobile: 0 margin (overlay style), On desktop: margin applies
          sidebarCollapsed ? "md:ml-16" : "md:ml-64"
        )}
      >
        {/* Mobile Hamburger Menu */}
        <div className="md:hidden flex items-center p-4 bg-white border-b sticky top-0 z-30">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="mr-2 p-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Image src="/ithac-logo.png" alt="ITHAC Logo" width={100} height={32} className="object-contain" />
        </div>

        {/* Mobile Overlay Backdrop */}
        {!sidebarCollapsed && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        <div className="px-4 md:px-0">
          {children}
        </div>
      </main>
    </div>
  );
}
