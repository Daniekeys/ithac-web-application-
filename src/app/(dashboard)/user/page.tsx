"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUserRecommendedCourses, useUserPopularCourses, useUserHistory } from "@/hooks/useUserCourse";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/types/course.types";
import { 
  User, 
  LogOut, 
  BookOpen, 
  Clock, 
  TrendingUp,
  History,
  Search,
  ShoppingCart,
  Bookmark,
  Star,
  ChevronRight,
  Play,
  Users,
  Award
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function UserDashboard() {
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuth();
  
  const { data: historyData, isLoading: loadingHistory, isSuccess: isHistorySuccess } = useUserHistory();
  const { data: recommendedData, isLoading: loadingRecommended } = useUserRecommendedCourses({ enabled: isHistorySuccess });
  const { data: popularData, isLoading: loadingPopular } = useUserPopularCourses({ enabled: isHistorySuccess });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">
            No user data found. Please log in again.
          </p>
          <Button onClick={() => logout.mutate()} className="mt-4">
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const CourseCard = ({ course, showProgress = false }: { course: Course, showProgress?: boolean }) => (
    <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
      <div className="aspect-video relative bg-gray-200 rounded-t-lg overflow-hidden">
        {course.image && (
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="h-4 w-4 mr-2" />
            {showProgress ? 'Continue' : 'Start'}
          </Button>
        </div>
        <Badge className={`absolute top-2 left-2 ${getLevelColor(course.level)}`} variant="secondary">
          {course.level}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {course.duration}h
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {course.enrolled_count || 0}
          </div>
          {(course.rating || 0) > 0 && (
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
              {(course.rating || 0)}
            </div>
          )}
        </div>

        {showProgress && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>65%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600">
            {formatPrice(course.amount)}
          </span>
          <Button size="sm" asChild>
            <Link href={`/user/courses/${course._id}`}>
              View Course
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const CourseSkeletonCard = () => (
    <Card>
      <Skeleton className="aspect-video w-full" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/user/cart">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/user/saved">
                  <Bookmark className="h-5 w-5" />
                </Link>
              </Button>
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2" asChild>
            <Link href="/user/courses">
              <Search className="h-6 w-6" />
              <span>Browse Courses</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2" asChild>
            <Link href="/user/history">
              <History className="h-6 w-6" />
              <span>My Learning</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2" asChild>
            <Link href="/user/cart">
              <ShoppingCart className="h-6 w-6" />
              <span>Cart</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2" asChild>
            <Link href="/user/certificates">
              <Award className="h-6 w-6" />
              <span>Certificates</span>
            </Link>
          </Button>
        </div>

        {/* Continue Learning */}
        {historyData?.data && historyData.data.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <History className="h-6 w-6 mr-2" />
                Continue Learning
              </h2>
              <Button variant="outline" asChild>
                <Link href="/user/history">
                  View All
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loadingHistory ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <CourseSkeletonCard key={i} />
                ))
              ) : (
                historyData.data.slice(0, 4).map((course: Course) => (
                  <CourseCard key={course._id} course={course} showProgress />
                ))
              )}
            </div>
          </section>
        )}

        {/* Recommended for You */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <BookOpen className="h-6 w-6 mr-2" />
              Recommended for You
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingRecommended ? (
              Array.from({ length: 4 }).map((_, i) => (
                <CourseSkeletonCard key={i} />
              ))
            ) : recommendedData?.data && recommendedData.data.length > 0 ? (
              recommendedData.data.slice(0, 4).map((course: Course) => (
                <CourseCard key={course._id} course={course} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No recommendations available</p>
                <Button className="mt-4" asChild>
                  <Link href="/user/courses">Browse All Courses</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Popular Courses */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2" />
              Popular Courses
            </h2>
            <Button variant="outline" asChild>
              <Link href="/user/courses">
                View All
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingPopular ? (
              Array.from({ length: 4 }).map((_, i) => (
                <CourseSkeletonCard key={i} />
              ))
            ) : popularData?.data && popularData.data.length > 0 ? (
              popularData.data.slice(0, 4).map((course: Course) => (
                <CourseCard key={course._id} course={course} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No popular courses available</p>
              </div>
            )}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{historyData?.total || 0}</p>
              <p className="text-gray-600">Courses Enrolled</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {historyData?.data?.reduce((acc: number, course: Course) => acc + (course.duration || 0), 0) || 0}h
              </p>
              <p className="text-gray-600">Hours Learned</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-gray-600">Certificates</p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
//        