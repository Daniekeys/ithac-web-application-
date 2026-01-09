"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,


  ChevronLeft,
  ChevronRight,
  Home,
  Clock,
  ShoppingCart,
  Bookmark,
  Award,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserDashboardStore } from "@/store/user-dashboard.store";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/user", icon: Home },
  { name: "Browse Courses", href: "/user/courses", icon: BookOpen },
  { name: "My Learning", href: "/user/history", icon: Clock },
  { name: "Cart", href: "/user/cart", icon: ShoppingCart },
  { name: "Saved Courses", href: "/user/saved", icon: Bookmark },
  { name: "Certificates", href: "/user/certificates", icon: Award },
  { name: "Profile", href: "/user/profile", icon: User },
];

export function UserSidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUserDashboardStore();
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 fixed left-0 top-0 h-full z-50",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!sidebarCollapsed && (
          <h2 className="text-xl font-bold text-gray-900">LearnHub</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="p-2"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="mt-8 px-2">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard/user" && pathname?.startsWith(item.href));
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                    sidebarCollapsed ? "justify-center" : ""
                  )}
                >
                  <item.icon
                    className={cn(
                      "flex-shrink-0 h-5 w-5",
                      isActive ? "text-blue-500" : "text-gray-400",
                      !sidebarCollapsed && "mr-3"
                    )}
                  />
                  {!sidebarCollapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
