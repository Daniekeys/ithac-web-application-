import { useEffect, useState } from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { Header } from "@/components/admin/header";
import { useAdminStore } from "@/store/admin.store";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { sidebarCollapsed } = useAdminStore();
  const { user, isAuthenticated, token } = useAuthStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const userType = sessionStorage.getItem("userType");
      // Strict check: Must be admin AND authenticated to stay on this page
      if (userType !== "admin" || !isAuthenticated || !token) {
        router.push("/admin-login");
      }
    }
  }, [isClient, router, isAuthenticated, token]);

  if (!isClient) {
    return null;
  }

  // Double check for render logic to avoid flashing content if not admin (though useEffect handles redirect)
  // We allow rendering if userType is admin AND authenticated, even if store is syncing.
  const userType = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem("userType") : null;
  if (userType !== "admin" || !isAuthenticated || !token) {
      return null;
  }

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main
          className={cn(
            "flex-1 overflow-auto transition-all duration-300 p-6",
            sidebarCollapsed ? "ml-16" : "ml-64"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
