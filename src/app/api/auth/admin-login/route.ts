import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://ithac.onrender.com/v1";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("👑 Admin login attempt:", { email: body.email });

    const response = await fetch(`${API_BASE_URL}/authentication/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("🔐 Admin API response status:", response.status);
    const data = await response.json();
    console.log("📊 Admin API response data:", data);

    // If admin login is successful and there's a token, return it
    if (data.success && data.token) {
      console.log("✅ Admin login successful");
      return NextResponse.json(data);
    }

    console.log("❌ Admin login failed:", data.error || "Unknown error");
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("🚨 Admin login API error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      cause:
        error instanceof Error && "cause" in error ? error.cause : undefined,
    });
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
