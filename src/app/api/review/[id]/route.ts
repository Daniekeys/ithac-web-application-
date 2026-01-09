import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/utils/env";

interface RouteParams {
  params: {
    id: string;
  };
}

// Get reviews for a course
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const backendResponse = await fetch(
      `${ENV.API_URL}/review/${params.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || "Failed to fetch reviews",
        },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get reviews error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
