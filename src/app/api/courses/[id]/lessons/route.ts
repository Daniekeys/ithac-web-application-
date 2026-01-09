import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get token from header or cookie
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No authentication token" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Call external API with authentication
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/course/${id}/lessons`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get token from header or cookie
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No authentication token" },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();

    // Call external API with authentication
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/course/${id}/lesson`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create lesson" },
      { status: 500 }
    );
  }
}
