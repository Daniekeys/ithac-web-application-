"use client";

import { useState } from "react";
import { LessonWithVideoForm } from "@/components/admin/lessons/lesson-with-video-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

export default function LessonWithVideoDemo() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    // Reset success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/video-upload-demo">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Demo
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  Lesson Creation with Video Upload
                </h1>
                <p className="text-gray-600">
                  Complete lesson creation workflow with integrated video upload
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        {showSuccess && (
          <div className="mb-8 max-w-4xl mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <p className="text-green-800 font-medium">
                  ✅ Lesson created successfully with video!
                </p>
              </div>
            </div>
          </div>
        )}

        <LessonWithVideoForm
          courseId="demo-course-123"
          onSuccess={handleSuccess}
          onCancel={() => console.log("Cancelled")}
        />

        {/* Usage Instructions */}
        <div className="max-w-4xl mx-auto mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Integration Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">✨ Key Features</h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Integrated form validation with video upload</li>
                    <li>• Real-time video preview after upload</li>
                    <li>• Automatic video metadata extraction</li>
                    <li>• Form state management with uploaded video data</li>
                    <li>• Engaging upload progress with detailed stages</li>
                    <li>• Error handling and user feedback</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">🔧 Technical Details</h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Built with React Hook Form + Zod validation</li>
                    <li>• Cloudinary video upload integration</li>
                    <li>• TypeScript for type safety</li>
                    <li>• Responsive design with Tailwind CSS</li>
                    <li>• Reusable component architecture</li>
                    <li>• Custom hooks for upload management</li>
                  </ul>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">📝 Usage Example</h3>
                <div className="bg-gray-100 rounded-lg p-3 font-mono text-sm">
                  <div className="text-gray-600">
                    {"// Import the component"}
                  </div>
                  <div>
                    import {`{LessonWithVideoForm}`} from
                    '@/components/admin/lessons/lesson-with-video-form';
                  </div>
                  <br />
                  <div className="text-gray-600">{"// Use in your page"}</div>
                  <div>{"<LessonWithVideoForm"}</div>
                  <div className="ml-4">courseId="your-course-id"</div>
                  <div className="ml-4">
                    onSuccess={`{() => console.log('Success!')}`}
                  </div>
                  <div className="ml-4">
                    onCancel={`{() => console.log('Cancelled')}`}
                  </div>
                  <div>{"/>"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
