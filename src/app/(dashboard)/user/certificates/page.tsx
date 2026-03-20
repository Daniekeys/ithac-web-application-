"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Download,
  Share2,
  Calendar,
  Medal,
  Lock,
  BookOpen,
  Search,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

// ── Mock data ──────────────────────────────────────────────────────────────────
const EARNED = [
  {
    id: "c1",
    courseTitle: "Introduction to Web Development",
    issuedDate: "January 15, 2025",
    credentialId: "ITHAC-2025-WD-00142",
    category: "Technology",
    accentColor: "from-blue-500 to-indigo-600",
  },
  {
    id: "c2",
    courseTitle: "Financial Literacy for Beginners",
    issuedDate: "February 3, 2025",
    credentialId: "ITHAC-2025-FIN-00219",
    category: "Finance",
    accentColor: "from-emerald-500 to-teal-600",
  },
  {
    id: "c3",
    courseTitle: "Business Communication Skills",
    issuedDate: "March 1, 2025",
    credentialId: "ITHAC-2025-BIZ-00308",
    category: "Business",
    accentColor: "from-amber-500 to-orange-600",
  },
];

const IN_PROGRESS = [
  {
    id: "ip1",
    courseTitle: "Advanced React & Next.js",
    progress: 68,
    category: "Technology",
  },
  {
    id: "ip2",
    courseTitle: "UI/UX Design Fundamentals",
    progress: 35,
    category: "Design",
  },
  {
    id: "ip3",
    courseTitle: "Data Science with Python",
    progress: 12,
    category: "Technology",
  },
];

// ── Certificate Card ───────────────────────────────────────────────────────────
function CertificateCard({
  cert,
}: {
  cert: (typeof EARNED)[0];
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(cert.credentialId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow group">
      {/* Certificate visual */}
      <div
        className={`relative bg-gradient-to-br ${cert.accentColor} h-44 flex flex-col items-center justify-center text-white px-6 text-center`}
      >
        {/* decorative rings */}
        <div className="absolute top-4 right-4 w-16 h-16 rounded-full border-2 border-white/20" />
        <div className="absolute bottom-4 left-4 w-10 h-10 rounded-full border-2 border-white/15" />

        <Award className="h-10 w-10 mb-2 drop-shadow" />
        <p className="text-xs font-semibold tracking-widest uppercase opacity-80 mb-1">
          Certificate of Completion
        </p>
        <p className="font-bold text-lg leading-tight line-clamp-2">
          {cert.courseTitle}
        </p>

        {/* Shimmer on hover */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Meta */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {cert.category}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="h-3.5 w-3.5" />
            {cert.issuedDate}
          </span>
        </div>

        {/* Credential ID */}
        <button
          onClick={handleCopy}
          title="Click to copy credential ID"
          className="w-full text-left"
        >
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">
              Credential ID
            </p>
            <p className="text-xs font-mono text-gray-700 truncate">
              {copied ? "✓ Copied!" : cert.credentialId}
            </p>
          </div>
        </button>

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 gap-1.5" variant="outline">
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
          <Button size="sm" className="flex-1 gap-1.5" variant="outline">
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
          <Button size="sm" variant="ghost" className="px-2">
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Locked Card ────────────────────────────────────────────────────────────────
function LockedCertCard({ course }: { course: (typeof IN_PROGRESS)[0] }) {
  return (
    <Card className="overflow-hidden opacity-70 hover:opacity-90 transition-opacity">
      <div className="relative h-44 bg-gradient-to-br from-gray-200 to-gray-300 flex flex-col items-center justify-center text-gray-400 px-6 text-center">
        <Lock className="h-8 w-8 mb-2" />
        <p className="text-xs font-semibold tracking-widest uppercase mb-1">
          Certificate Locked
        </p>
        <p className="font-semibold text-sm text-gray-600 line-clamp-2">
          {course.courseTitle}
        </p>
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">{course.category}</Badge>
          <span className="text-xs text-gray-500">{course.progress}% complete</span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-gray-400 h-2 rounded-full transition-all"
            style={{ width: `${course.progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 text-center">
          Complete this course to unlock your certificate
        </p>
        <Button size="sm" variant="outline" className="w-full gap-1.5" asChild>
          <Link href="/user/courses">
            <BookOpen className="h-3.5 w-3.5" />
            Continue Learning
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CertificatesPage() {
  const [search, setSearch] = useState("");

  const filteredEarned = EARNED.filter((c) =>
    c.courseTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-10">
      {/* ── Hero Header ────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-6 py-10 md:rounded-b-2xl">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Award className="h-7 w-7 opacity-80" />
            <h1 className="text-3xl font-bold">My Certificates</h1>
          </div>
          <p className="text-orange-100 text-sm">
            Showcase your achievements and share your credentials.
          </p>

          {/* Summary badges */}
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3 flex items-center gap-3">
              <Medal className="h-6 w-6" />
              <div>
                <p className="text-xl font-bold">{EARNED.length}</p>
                <p className="text-xs text-orange-100">Certificates Earned</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3 flex items-center gap-3">
              <Lock className="h-6 w-6" />
              <div>
                <p className="text-xl font-bold">{IN_PROGRESS.length}</p>
                <p className="text-xs text-orange-100">In Progress</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3 flex items-center gap-3">
              <Award className="h-6 w-6" />
              <div>
                <p className="text-xl font-bold">{EARNED.length + IN_PROGRESS.length}</p>
                <p className="text-xs text-orange-100">Total Enrolled</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 space-y-10">
        {/* ── Search ─────────────────────────────────────────────────── */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search certificates…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* ── Earned Certificates ────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Medal className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-bold text-gray-900">
              Earned Certificates
            </h2>
            <span className="ml-auto bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {filteredEarned.length}
            </span>
          </div>

          {filteredEarned.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Award className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No certificates match your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredEarned.map((cert) => (
                <CertificateCard key={cert.id} cert={cert} />
              ))}
            </div>
          )}
        </section>

        {/* ── In Progress ────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Lock className="h-5 w-5 text-gray-400" />
            <h2 className="text-xl font-bold text-gray-900">
              Certificates in Progress
            </h2>
            <span className="ml-auto bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">
              {IN_PROGRESS.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {IN_PROGRESS.map((course) => (
              <LockedCertCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-100 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Ready for more achievements?
            </h3>
            <p className="text-sm text-gray-500">
              Browse our full course catalog and earn new certificates.
            </p>
          </div>
          <Button className="gap-2 shrink-0" asChild>
            <Link href="/user/courses">
              <BookOpen className="h-4 w-4" />
              Browse Courses
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
