"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  History,
  Search,
  Clock,
  BookOpen,
  Play,
  CheckCircle2,
  Filter,
  Star,
  AlertCircle,
} from "lucide-react";
import { useSubscribedCourses } from "@/hooks/useUserCourse";
import type { Course } from "@/types/course.types";


const TABS = ["All", "Free", "Paid"];

// ── Skeleton card ────────────────────────────────────────────────────────────
function CourseCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-40 w-full rounded-none" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-full" />
      </CardContent>
    </Card>
  );
}

export default function LearningHistoryPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error } = useSubscribedCourses();

  const courses: Course[] = data?.data ?? [];

  const filtered = courses.filter((c) => {
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Paid" && c.amount > 0) ||
      (activeTab === "Free" && c.amount === 0);
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalCourses = courses.length;
  const paidCourses = courses.filter((c) => c.amount > 0).length;
  const freeCourses = courses.filter((c) => c.amount === 0).length;
  const subscribedCount = courses.filter((c) => c.Subscribed).length;

  const STATS = [
    {
      label: "Total Courses",
      value: totalCourses,
      icon: BookOpen,
    },
    {
      label: "Subscribed",
      value: subscribedCount,
      icon: CheckCircle2,
    },
    {
      label: "Paid Courses",
      value: paidCourses,
      icon: Star,
    },
    {
      label: "Free Courses",
      value: freeCourses,
      icon: History,
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-10 md:rounded-b-2xl">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <History className="h-7 w-7 opacity-80" />
            <h1 className="text-3xl font-bold">My Courses</h1>
          </div>
          <p className="text-blue-100 text-sm">
            All courses available to you — both free and paid subscriptions.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="bg-white/15 backdrop-blur-sm rounded-xl p-4"
              >
                <s.icon className="h-5 w-5 mb-1 opacity-80" />
                {isLoading ? (
                  <div className="h-8 w-10 bg-white/20 rounded animate-pulse mb-1" />
                ) : (
                  <p className="text-2xl font-bold">{s.value}</p>
                )}
                <p className="text-xs text-blue-100">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* ── Search + Filter Bar ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search your courses…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Error State ──────────────────────────────────────────────── */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-20 text-red-500 gap-3">
            <AlertCircle className="h-12 w-12 opacity-60" />
            <p className="text-lg font-medium">Failed to load courses</p>
            <p className="text-sm text-gray-400">
              {(error as any)?.response?.data?.error ||
                "Please try again later."}
            </p>
          </div>
        )}

        {/* ── Loading Skeletons ────────────────────────────────────────── */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* ── Course Cards ─────────────────────────────────────────────── */}
        {!isLoading && !isError && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p className="text-lg font-medium">No courses found</p>
                <p className="text-sm mt-1">
                  Try adjusting your search or filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((course) => (
                  <Card
                    key={course._id}
                    className="overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-40 bg-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="secondary" className="gap-1">
                          <Play className="h-4 w-4" />
                          Start Learning
                        </Button>
                      </div>

                      {/* Subscribed badge */}
                      <div className="absolute top-2 right-2">
                        {course.Subscribed ? (
                          <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="h-3 w-3" /> Subscribed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-gray-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                            Not Subscribed
                          </span>
                        )}
                      </div>

                      {/* Price badge */}
                      <Badge
                        className="absolute top-2 left-2 bg-white/90 text-gray-700 text-xs"
                        variant="secondary"
                      >
                        {course.amount > 0
                          ? `₦${course.amount.toLocaleString()}`
                          : "Free"}
                      </Badge>
                    </div>

                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {course.tagline}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {course.duration > 0
                            ? `${course.duration} mins`
                            : "—"}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" />
                          {course.lessons.length}{" "}
                          {course.lessons.length === 1 ? "lesson" : "lessons"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          {(course.rating ?? 0) > 0 ? (course.rating ?? 0) : "—"}
                        </span>
                      </div>

                      {/* Tags */}
                      {course.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {course.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full capitalize"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Instructor */}
                      <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={course.main_contributor.image}
                          alt={course.main_contributor.name}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                        <p className="text-xs text-gray-500 truncate">
                          {course.main_contributor.name}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
