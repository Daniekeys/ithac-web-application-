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

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const { sidebarCollapsed } = useUserDashboardStore();
  const { isAuthenticated, token } = useAuthStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
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
          "flex-1 transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        {children}
      </main>
    </div>
  );
}
