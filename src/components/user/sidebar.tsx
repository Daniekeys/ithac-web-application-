"use client";

import Link from "next/link";
import Image from "next/image";
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
  User,
  CurrencyIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserDashboardStore } from "@/store/user-dashboard.store";
import { useAuthStore } from "@/store/auth.store";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/user", icon: Home },
  { name: "Browse Courses", href: "/user/courses", icon: BookOpen },
  { name: "My Learning", href: "/user/history", icon: Clock },
  { name: "Cart", href: "/user/cart", icon: ShoppingCart },
  { name: "Saved Courses", href: "/user/saved", icon: Bookmark },
  { name: "Certificates", href: "/user/certificates", icon: Award },
  { name: "Profile", href: "/user/profile", icon: User },
  { name: "Payment Histories", href: "/user/payments", icon: CurrencyIcon   },
];

export function UserSidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUserDashboardStore();
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 fixed left-0 top-0 h-full z-50",
        sidebarCollapsed ? "-translate-x-full md:translate-x-0 w-64 md:w-16" : "translate-x-0 w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!sidebarCollapsed && (
          <Image src="/ithac-logo.png" alt="ITHAC Logo" width={120} height={40} className="object-contain" />
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

      {/* User Info & Logout (Bottom) */}
      <div className="absolute bottom-0 w-full border-t border-gray-200 bg-white p-4">
        {!sidebarCollapsed ? (
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold flex-shrink-0 capitalize">
                {user?.firstname?.charAt(0) || "U"}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-sm font-medium text-gray-900 truncate capitalize">
                  {user?.firstname + " " + user?.lastname || "Student"}
                </span>
                <span className="text-xs text-gray-500 truncate">
                  {user?.email || "student@example.com"}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => logout.mutate()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => logout.mutate()}
              title="Log Out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
