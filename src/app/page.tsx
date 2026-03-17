"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, Users, Award, PlayCircle, Code, Briefcase, ChevronRight } from "lucide-react";
import { HeroSection } from "@/components/blocks/hero-section-9";
import { CourseSection } from "@/components/blocks/course-section";

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === "admin" ? "/admin" : "/user";
      router.push(redirectPath);
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-500 selection:text-white">
      <HeroSection />

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-2">Why Choose Us</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">An Ecosystem Built for Growth</h3>
            <p className="text-lg text-slate-600">We don't just provide videos; we provide an interactive learning environment designed to help you truly master your craft.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="h-6 w-6 text-indigo-600" />,
                title: "Curated Curriculums",
                desc: "Step-by-step learning paths tailored to take you from absolute beginner to industry professional.",
                color: "bg-indigo-100"
              },
              {
                icon: <Code className="h-6 w-6 text-blue-600" />,
                title: "Hands-on Projects",
                desc: "Build real-world applications in our interactive environments to solidify your theoretical knowledge.",
                color: "bg-blue-100"
              },
              {
                icon: <Award className="h-6 w-6 text-purple-600" />,
                title: "Verified Credentials",
                desc: "Earn certificates upon completion that you can proudly showcase on your resume and LinkedIn profile.",
                color: "bg-purple-100"
              },
              {
                icon: <Users className="h-6 w-6 text-emerald-600" />,
                title: "Expert Mentorship",
                desc: "Get answers to your questions directly from industry veterans who have been there and done that.",
                color: "bg-emerald-100"
              },
              {
                icon: <Briefcase className="h-6 w-6 text-orange-600" />,
                title: "Career Assistance",
                desc: "From portfolio reviews to interview prep, we help you land your dream job after graduation.",
                color: "bg-orange-100"
              },
              {
                icon: <PlayCircle className="h-6 w-6 text-pink-600" />,
                title: "On-Demand Access",
                desc: "Learn at your own pace with lifetime access to materials, including future updates to the curriculum.",
                color: "bg-pink-100"
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="group bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(79,70,229,0.15)] transition-all duration-300 border border-slate-100 hover:-translate-y-1"
              >
                <div className={`${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <CourseSection />

      {/* Stats Section with Dark Premium Feel */}
      <section className="py-24 bg-indigo-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/auth-bg.png')] opacity-10 mix-blend-overlay bg-center bg-cover" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-indigo-800/50">
             {[
               { value: "50K+", label: "Active Students" },
               { value: "200+", label: "Premium Courses" },
               { value: "95%", label: "Completion Rate" },
               { value: "4.9/5", label: "Average Rating" },
             ].map((stat, idx) => (
               <div key={idx} className="text-center px-4">
                 <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">{stat.value}</div>
                 <div className="text-indigo-200 font-medium text-sm md:text-base">{stat.label}</div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[3rem] p-12 md:p-20 border border-indigo-100 shadow-xl shadow-indigo-900/5"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Ready to start your journey?</h2>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              Join thousands of learners achieving their goals with us. Create an account today and get lifetime access to our community.
            </p>
            <Link href="/register">
              <Button size="lg" className="px-10 py-7 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-600/30 transition-all hover:scale-105">
                Create Free Account
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center bg-transparent">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="font-bold text-xl text-slate-900">
               <Image src="/ithac-logo.png" alt="ITHAC" width={100} height={30} className="object-contain" />
            </div>
            <span className="text-slate-500 text-sm ml-4">© {new Date().getFullYear()} ITHAC Learning. All rights reserved.</span>
          </div>
          <div className="flex space-x-6">
            <Link href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">Terms of Service</Link>
            <Link href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
