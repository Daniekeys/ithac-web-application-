"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  History,
  Search,
  Clock,
  BookOpen,
  Play,
  CheckCircle2,
  Filter,
  TrendingUp,
  Star,
  Calendar,
} from "lucide-react";
import Link from "next/link";

// ── Mock data ──────────────────────────────────────────────────────────────────
const MOCK_COURSES = [
  {
    id: "1",
    title: "Introduction to Web Development",
    category: "Technology",
    progress: 100,
    status: "completed",
    duration: 12,
    lastAccessed: "2 days ago",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80",
    instructor: "James Okafor",
  },
  {
    id: "2",
    title: "Advanced React & Next.js",
    category: "Technology",
    progress: 68,
    status: "in-progress",
    duration: 20,
    lastAccessed: "Yesterday",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80",
    instructor: "Amara Diallo",
  },
  {
    id: "3",
    title: "Financial Literacy for Beginners",
    category: "Finance",
    progress: 100,
    status: "completed",
    duration: 8,
    lastAccessed: "1 week ago",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
    instructor: "Chidi Nwosu",
  },
  {
    id: "4",
    title: "UI/UX Design Fundamentals",
    category: "Design",
    progress: 35,
    status: "in-progress",
    duration: 15,
    lastAccessed: "3 days ago",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
    instructor: "Fatima Yusuf",
  },
  {
    id: "5",
    title: "Data Science with Python",
    category: "Technology",
    progress: 12,
    status: "in-progress",
    duration: 25,
    lastAccessed: "5 days ago",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
    instructor: "Emeka Obi",
  },
  {
    id: "6",
    title: "Business Communication Skills",
    category: "Business",
    progress: 100,
    status: "completed",
    duration: 6,
    lastAccessed: "2 weeks ago",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80",
    instructor: "Ngozi Adeyemi",
  },
];

const TABS = ["All", "In Progress", "Completed"];

const STATS = [
  { label: "Courses Enrolled", value: 6, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Completed", value: 3, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  { label: "Hours Learned", value: "41h", icon: Clock, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Avg. Rating Given", value: "4.7", icon: Star, color: "text-yellow-500", bg: "bg-yellow-50" },
];

export default function LearningHistoryPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = MOCK_COURSES.filter((c) => {
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "In Progress" && c.status === "in-progress") ||
      (activeTab === "Completed" && c.status === "completed");
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-10">
      {/* ── Page Header ───────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-10 md:rounded-b-2xl">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <History className="h-7 w-7 opacity-80" />
            <h1 className="text-3xl font-bold">My Learning</h1>
          </div>
          <p className="text-blue-100 text-sm">
            Track your progress across all enrolled courses.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
                <s.icon className="h-5 w-5 mb-1 opacity-80" />
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-blue-100">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* ── Search + Filter Bar ────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search your courses…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
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

        {/* ── Course Cards ──────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">No courses found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
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
                      {course.status === "completed" ? "Review" : "Continue"}
                    </Button>
                  </div>
                  {/* Status badge */}
                  <div className="absolute top-2 right-2">
                    {course.status === "completed" ? (
                      <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="h-3 w-3" /> Done
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                        <TrendingUp className="h-3 w-3" /> {course.progress}%
                      </span>
                    )}
                  </div>
                  {/* Category */}
                  <Badge
                    className="absolute top-2 left-2 bg-white/90 text-gray-700 text-xs"
                    variant="secondary"
                  >
                    {course.category}
                  </Badge>
                </div>

                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 leading-snug">
                    {course.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {course.duration}h total
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {course.lastAccessed}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      {course.rating}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-1.5" />
                  </div>

                  <p className="text-xs text-gray-400">by {course.instructor}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
