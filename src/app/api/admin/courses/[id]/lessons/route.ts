import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/utils/env";

// GET all lessons for a course
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // GET /api/admin/courses/:id/lessons
  // Use courseService.adminGetCourseLessons(courseId)
  // ...implement logic here
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, error: "No authentication token found" },
      { status: 401 }
    );
  }

  const backendResponse = await fetch(`${ENV.API_URL}/course/${params.id}/lessons`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await backendResponse.json();

  if (!backendResponse.ok) {
    return NextResponse.json(
      { success: false, error: data.error || "Failed to fetch lessons" },
      { status: backendResponse.status }
    );
  }

  return NextResponse.json(data);
  return NextResponse.json({
    message: "Get all lessons for course " + params.id,
  });
}

// POST create a lesson for a course
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // POST /api/admin/courses/:id/lessons
  // Use courseService.adminCreateLesson(courseId, lessonData)
  // ...implement logic here
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies.get("token")?.value;
  
    if (!token) {
      return NextResponse.json(
        { success: false, error: "No authentication token found" },
        { status: 401 }
      );
    }
  
    const body = await req.json();
  
    const backendResponse = await fetch(`${ENV.API_URL}/course/${params.id}/lesson`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  console.log("🔍 backendResponse:", params.id);
    const data = await backendResponse.json();
  
    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || "Failed to create course",
        },
        { status: backendResponse.status }
      );
    }
  
    return NextResponse.json(data);
  } catch (error) {
    console.error("Admin create course error:", error);
    return NextResponse.json({
      message: "Create lesson for course " + params.id,
    });
  }
}


