"use client";

import React, { useRef } from "react";
import { Award } from "lucide-react";

interface CertificatePreviewProps {
  template: "classic" | "modern" | "minimal";
  userName: string;
  courseName: string;
  date: string;
}

export function CertificatePreview({
  template,
  userName,
  courseName,
  date,
}: CertificatePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const getTemplateStyles = () => {
    switch (template) {
      case "modern":
        return "border-8 border-blue-600 bg-white";
      case "minimal":
        return "border border-gray-200 bg-gray-50";
      case "classic":
      default:
        return "border-double border-8 border-amber-600 bg-[#fff9f0]";
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <div
        ref={containerRef}
        className={`aspect-[1.414/1] relative p-12 flex flex-col items-center justify-center text-center shadow-lg transition-all ${getTemplateStyles()}`}
      >
        {template === "classic" && (
          <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-amber-600 opacity-20 pointer-events-none" />
        )}

        <Award
          className={`h-16 w-16 mb-6 ${
            template === "modern"
              ? "text-blue-600"
              : template === "minimal"
              ? "text-gray-800"
              : "text-amber-600"
          }`}
        />

        <div className="space-y-2 mb-8">
          <h1
            className={`text-4xl font-serif font-bold ${
              template === "modern" ? "text-blue-900" : "text-gray-900"
            }`}
          >
            Certificate of Completion
          </h1>
          <p className="text-gray-500 uppercase tracking-widest text-sm">
            This is to certify that
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif italic border-b-2 border-gray-200 px-8 pb-2">
          {userName}
        </h2>

        <p className="text-gray-600 mb-6 max-w-lg">
          has successfully completed all requirements for the course
        </p>

        <h3 className="text-2xl font-bold text-gray-800 mb-8 max-w-2xl">
          {courseName}
        </h3>

        <div className="flex items-end justify-between w-full max-w-2xl mt-auto">
          <div className="text-center">
            <div className="mb-2 font-dancing-script text-xl text-gray-700">
              {date}
            </div>
            <div className="border-t border-gray-400 w-32 mx-auto pt-1 text-xs text-gray-500 uppercase">
              Date
            </div>
          </div>

          <div className="h-16 w-16 opacity-80">
            {/* Seal placeholder */}
            <div className="border-4 border-dashed rounded-full h-full w-full flex items-center justify-center text-[10px] text-gray-400 font-bold uppercase rotate-[-15deg]">
              Official Seal
            </div>
          </div>

          <div className="text-center">
            <div className="mb-2 font-dancing-script text-xl text-gray-700">
              Administrator
            </div>
            <div className="border-t border-gray-400 w-32 mx-auto pt-1 text-xs text-gray-500 uppercase">
              Signature
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
