"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CertificatePreview } from "@/components/admin/certificates/certificate-preview";
import { toast } from "@/hooks/use-toast";

export default function AdminCertificatesPage() {
  const [template, setTemplate] = useState<"classic" | "modern" | "minimal">("classic");
  const [demoUser, setDemoUser] = useState("John Doe");
  const [demoCourse, setDemoCourse] = useState("Introduction to Web Development");

  const handleSave = () => {
    toast({
      title: "Template Saved",
      description: "Certificate template configuration has been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Certificate Management
          </h1>
          <p className="text-gray-600 mt-1">
            Design and issue certificates for your courses
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Template Design</Label>
                  <Select
                    value={template}
                    onValueChange={(v) =>
                      setTemplate(v as "classic" | "modern" | "minimal")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Preview Name</Label>
                  <Input
                    value={demoUser}
                    onChange={(e) => setDemoUser(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Preview Course</Label>
                  <Input
                    value={demoCourse}
                    onChange={(e) => setDemoCourse(e.target.value)}
                  />
                </div>

                <Button className="w-full" onClick={handleSave}>
                  Save Template Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-500">
                <p className="mb-2">
                  Certificates are automatically generated when a user reaches
                  100% completion on a course.
                </p>
                <p>
                  Ensure your template settings align with your brand guidelines.
                  Changes affect all future certificates.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center bg-gray-100 p-8 min-h-[500px]">
                <CertificatePreview
                  template={template}
                  userName={demoUser}
                  courseName={demoCourse}
                  date={new Date().toLocaleDateString()}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
