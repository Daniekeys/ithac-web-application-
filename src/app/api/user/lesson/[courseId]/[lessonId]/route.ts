import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/utils/env";

interface RouteParams {
  params: {
    courseId: string;
    lessonId: string;
  };
}

// Watch a lesson
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No authentication token found" },
        { status: 401 }
      );
    }

    const backendResponse = await fetch(
      `${ENV.API_URL}/user/lesson/${params.courseId}/${params.lessonId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || "Failed to fetch lesson",
        },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Watch lesson error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
