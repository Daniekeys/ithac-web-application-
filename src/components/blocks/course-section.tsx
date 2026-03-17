"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/types/course.types";
import { BookOpen, Clock, Users, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

const getLevelColor = (level: string) => {
  switch (level?.toLowerCase()) {
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

const CourseCard = ({ course }: { course: Course }) => {
  return (
    <Link href={`/login`}> {/* Pointing to login as it's the landing page, or we could point to course details if that exists publicly */}
      <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col relative border border-slate-200 hover:border-indigo-300 bg-white rounded-3xl overflow-hidden hover:-translate-y-1">
        <div className="aspect-video relative bg-slate-100 overflow-hidden">
          {course.image ? (
            <Image
              src={course.image}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100">
              <BookOpen className="h-10 w-10 text-slate-400 group-hover:text-indigo-400 transition-colors" />
            </div>
          )}
          
          {/* Level Badge */}
          {course.level && (
            <Badge
              className={`absolute top-3 left-3 ${getLevelColor(course.level)} border-none font-medium px-3 py-1 shadow-sm backdrop-blur-md`}
              variant="secondary"
            >
              {course.level}
            </Badge>
          )}
        </div>

        <CardContent className="p-6 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-slate-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
              {course.title}
            </h3>
            <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <div className="flex items-center bg-slate-50 px-2 py-1 rounded-md">
                <Clock className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
                {course.duration || 0}h
              </div>
              <div className="flex items-center bg-slate-50 px-2 py-1 rounded-md">
                <Users className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                {course.enrolled_count || 0}
              </div>
              {(course.rating || 0) > 0 && (
                <div className="flex items-center bg-slate-50 px-2 py-1 rounded-md">
                  <Star className="h-3.5 w-3.5 mr-1.5 fill-yellow-400 text-yellow-500" />
                  {(course.rating || 0).toFixed(1)}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {formatPrice(course.amount || 0)}
              </span>
              <span className="flex items-center text-sm font-semibold text-indigo-600 group-hover:text-indigo-700 transition-colors">
                Explore <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const dummyCourses: Partial<Course>[] = [
  {
    _id: "1",
    title: "Full-Stack Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB from scratch. Build real-world projects and become a full-stack developer.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2944&auto=format&fit=crop",
    level: "beginner",
    duration: 48,
    enrolled_count: 1250,
    rating: 4.8,
    amount: 1999.99,
  },
  {
    _id: "2",
    title: "Advanced React & Next.js Patterns",
    description: "Master server-side rendering, static site generation, and state management. Build high-performance web applications with Next.js 14.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2670&auto=format&fit=crop",
    level: "advanced",
    duration: 32,
    enrolled_count: 840,
    rating: 4.9,
    amount: 2999.99,
  },
  {
    _id: "3",
    title: "UI/UX Design Masterclass",
    description: "Learn Figma, design systems, and user research. Create stunning interfaces and improve user experiences for web and mobile apps.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop",
    level: "intermediate",
    duration: 24,
    enrolled_count: 2100,
    rating: 4.7,
    amount: 3999.99,
  },
  {
    _id: "4",
    title: "Machine Learning A-Z: Python & R",
    description: "Learn to create Machine Learning Algorithms in Python and R from two Data Science experts. Includes templates and datasets.",
    image: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?q=80&w=2874&auto=format&fit=crop",
    level: "advanced",
    duration: 60,
    enrolled_count: 3400,
    rating: 4.9,
    amount: 4999.99,
  },
  {
    _id: "5",
    title: "The Complete Digital Marketing Course",
    description: "Master Digital Marketing Strategy, Social Media Marketing, SEO, YouTube, Email, Facebook Marketing, Analytics & More!",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop",
    level: "beginner",
    duration: 36,
    enrolled_count: 4500,
    rating: 4.6,
    amount: 5999.99,
  },
  {
    _id: "6",
    title: "Mobile App Development with Flutter",
    description: "Build beautiful, fast and native-quality apps for iOS and Android using Google's UI Toolkit: Flutter.",
    image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=2940&auto=format&fit=crop",
    level: "intermediate",
    duration: 40,
    enrolled_count: 1800,
    rating: 4.8,
    amount: 6999.99,
  }
];

export const CourseSection = () => {
  return (
    <section id="courses" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-2">Featured Programs</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              Explore Our Top Courses
            </h3>
            <p className="text-lg text-slate-600">
              Discover our carefully curated selection of highly-rated courses designed to elevate your skills and advance your career.
            </p>
          </div>
          <Link href="/login" className="hidden md:inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
            View All Courses <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyCourses.map((course: Partial<Course>, idx: number) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <CourseCard course={course as Course} />
            </motion.div>
          ))}
        </div>

        {/* Mobile View All button */}
        <div className="mt-10 text-center md:hidden">
            <Link href="/login" className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
              View All Courses <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
        </div>
      </div>
    </section>
  );
};
