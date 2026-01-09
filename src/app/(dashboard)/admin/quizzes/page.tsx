"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";

export default function AdminQuizzesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
      <Card className="max-w-md w-full text-center p-8">
        <CardContent className="space-y-6 pt-6">
          <div className="bg-blue-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <BrainCircuit className="h-10 w-10 text-blue-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Quiz Management
            </h1>
            <p className="text-gray-500">
              The quiz management system is currently under development. APIs for
              creating and managing quizzes are not yet available.
            </p>
          </div>
          <div className="pt-4">
            <p className="text-sm font-medium text-blue-600 bg-blue-50 py-2 px-4 rounded-full inline-block">
              Coming Soon
            </p>
          </div>
          <p className="text-xs text-gray-400">
            Please check back later for updates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
