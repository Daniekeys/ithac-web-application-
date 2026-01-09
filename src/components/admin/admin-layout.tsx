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
      if (!isAuthenticated || !token || user?.role !== "admin") {
        router.push("/admin-login");
      }
    }
  }, [isClient, isAuthenticated, token, user, router]);

  if (!isClient || !isAuthenticated || !token || user?.role !== "admin") {
    return null; // Or a loading spinner
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
