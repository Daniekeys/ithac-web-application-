import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://ithac.onrender.com/v1";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("🔐 Login attempt:", { email: body.email });

    const response = await fetch(`${API_BASE_URL}/authentication/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("📡 External API response status:", response.status);
    const data = await response.json();
    console.log("📊 External API response:", {
      success: data.success,
      status: data.status,
    });

    // If login is successful and there's a token, set it as httpOnly cookie
    if (data.success && data.token) {
      const nextResponse = NextResponse.json(data);
      nextResponse.cookies.set("token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
      return nextResponse;
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("🚨 Login API error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      cause:
        error instanceof Error && "cause" in error ? error.cause : undefined,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to authentication server",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
