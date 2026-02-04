"use client";

import React, { useState } from "react";
import {
  useUserCourse,
  useAddToCart,
  useAddToSaved,
  useRemoveFromSaved,
  useUserSavedCourses,
  useUserCourseReviews,
  useCreateReview,
} from "@/hooks/useUserCourse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  ShoppingCart,
  Bookmark,
  User,
  ChevronRight,
  Heart,
  Share2,
} from "lucide-react";
import { Course, Lesson, Review } from "@/types/course.types";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";



export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [selectedRating, setSelectedRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "curriculum" | "reviews"
  >("overview");

  const { data: courseData, isLoading, isError } = useUserCourse(courseId);
  const { data: reviewsData } = useUserCourseReviews(courseId);
  const { data: savedCoursesData } = useUserSavedCourses();
  const addToCart = useAddToCart();
  const addToSaved = useAddToSaved();
  const removeFromSaved = useRemoveFromSaved();
  const createReview = useCreateReview();

  const course: Course | undefined = courseData?.data;
  const lessons: Lesson[] = courseData?.lessons || [];

  const isSaved = savedCoursesData?.data?.some(
    (savedCourse: Course) => savedCourse._id === courseId
  );

  const handleAddToCart = () => {
    if (course) {
      addToCart.mutate(course._id);
    }
  };

  const handleToggleSaved = () => {
    if (course) {
      if (isSaved) {
        removeFromSaved.mutate(course._id);
      } else {
        addToSaved.mutate(course._id);
      }
    }
  };

  const handleSubmitReview = () => {
    if (course && reviewText.trim()) {
      createReview.mutate({
        courseId: course._id,
        reviewData: {
          rating: selectedRating,
          body: reviewText,
        },
      });
      setReviewText("");
      setSelectedRating(5);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onRatingChange?: (rating: number) => void
  ) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        } ${interactive ? "cursor-pointer" : ""}`}
        onClick={() => interactive && onRatingChange && onRatingChange(i + 1)}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600">Failed to load course details</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/dashboard/user" className="hover:text-blue-600">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href="/dashboard/user/courses"
              className="hover:text-blue-600"
            >
              Courses
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">{course.title}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Hero Image/Video */}
              <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-600 to-purple-600">
                {course.image && (
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="bg-white/20 hover:bg-white/30 text-white"
                  >
                    <Play className="h-6 w-6 mr-2" />
                    Preview Course
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge
                    className={getLevelColor(course.level)}
                    variant="secondary"
                  >
                    {course.level}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleToggleSaved}
                      className={isSaved ? "text-red-500 hover:text-red-600" : ""}
                    >
                      <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {course.title}
                </h1>
                <p className="text-xl text-gray-600 mb-4">{course.tagline}</p>

                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration} hours
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {course.enrolled_count || 0} students
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {lessons.length} lessons
                  </div>
                  {course.rating && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                      {course.rating} ({reviewsData?.total || 0} reviews)
                    </div>
                  )}
                </div>

                {/* Instructor */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {course.main_contributor.image ? (
                      <Image
                        src={course.main_contributor.image}
                        alt={course.main_contributor.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {course.main_contributor.name}
                    </p>
                    <p className="text-sm text-gray-600">Course Instructor</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b">
                <nav className="flex space-x-8 px-6">
                  {(["overview", "curriculum", "reviews"] as const).map(
                    (tab) => (
                      <button
                        key={tab}
                        className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                          activeTab === tab
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab}
                      </button>
                    )
                  )}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-3">
                      About this course
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {course.description}
                    </p>

                    {course.tags.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium mb-2">Topics covered:</h4>
                        <div className="flex flex-wrap gap-2">
                          {course.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "curriculum" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-3">
                      Course Curriculum
                    </h3>
                    {lessons.length > 0 ? (
                      <div className="space-y-3">
                        {lessons.map((lesson, index) => (
                          <div
                            key={lesson._id}
                            className="border rounded-lg p-4 hover:bg-gray-50"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                                  {index + 1}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {lesson.title}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {lesson.description}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                {lesson.duration}m
                                {lesson.free && (
                                  <Badge
                                    variant="outline"
                                    className="text-green-600 border-green-300"
                                  >
                                    Free
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No lessons available yet.</p>
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Reviews</h3>

                    {/* Add Review */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Write a Review
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating
                          </label>
                          <div className="flex items-center space-x-1">
                            {renderStars(
                              selectedRating,
                              true,
                              setSelectedRating
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Review
                          </label>
                          <Textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Share your experience with this course..."
                            rows={4}
                          />
                        </div>
                        <Button
                          onClick={handleSubmitReview}
                          disabled={
                            createReview.isPending || !reviewText.trim()
                          }
                        >
                          Submit Review
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Reviews List */}
                    {reviewsData?.data && reviewsData.data.length > 0 ? (
                      <div className="space-y-4">
                        {reviewsData.data.map((review: Review) => (
                          <div
                            key={review._id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-500" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-gray-900">
                                    {review.user.name}
                                  </h4>
                                  <div className="flex items-center space-x-1">
                                    {renderStars(review.rating)}
                                  </div>
                                </div>
                                <p className="text-gray-700">{review.body}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        No reviews yet. Be the first to review this course!
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600 mb-4">
                  {formatPrice(course.amount)}
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={addToCart.isPending}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>

                  <Button
                    variant="outline"
                    className={`w-full ${isSaved ? "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200" : ""}`}
                    onClick={handleToggleSaved}
                    disabled={addToSaved.isPending || removeFromSaved.isPending}
                  >
                    <Heart className={`h-5 w-5 mr-2 ${isSaved ? "fill-current" : ""}`} />
                    {isSaved ? "Saved" : "Save for Later"}
                  </Button>
                </div>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{course.duration} hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Lessons</span>
                    <span className="font-medium">{lessons.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Language</span>
                    <span className="font-medium">{course.language}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Level</span>
                    <span className="font-medium capitalize">
                      {course.level}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Other Contributors */}
            {course.other_contributor &&
              course.other_contributor.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Other Contributors
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {course.other_contributor.map((contributor) => (
                      <div
                        key={contributor._id}
                        className="flex items-center space-x-3"
                      >
                        <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          {contributor.image ? (
                            <Image
                              src={contributor.image}
                              alt={contributor.name}
                              width={32}
                              height={32}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {contributor.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {contributor.nickname}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
