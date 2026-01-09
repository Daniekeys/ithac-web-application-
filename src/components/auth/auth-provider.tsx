"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Define auth pages - always allow access
  const authPages = ["/login", "/register", "/admin-login"];
  const isAuthPage = authPages.some((page) => pathname.startsWith(page));

  useEffect(() => {
    // Set initialization flag after mount
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    // Only redirect if user is authenticated and on auth page
    if (user && isAuthPage) {
      const redirectPath =
        user.role === "admin" ? "/admin" : "/user";
      console.log(
        "🔄 Authenticated user on auth page, redirecting to:",
        redirectPath
      );
      router.push(redirectPath);
      return;
    }
  }, [user, isInitialized, pathname, router, isAuthPage]);

  // Just show children once initialized - no blocking
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
