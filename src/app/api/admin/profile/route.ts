import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(request: NextRequest) {
  console.log("🚀 Admin Profile Route Called");
  console.log("🔗 API_BASE_URL:", API_BASE_URL);

  try {
    const cookieStore = cookies();
    const authHeader = request.headers.get("Authorization");
    
    // Try to get token from Authorization header (Bearer token) or fallback to cookie
    const token = authHeader?.startsWith("Bearer ") 
      ? authHeader.split(" ")[1] 
      : cookieStore.get("token")?.value;

    console.log("🍪 Token check - Source:", authHeader ? "Header" : "Cookie");
    console.log("🔑 Token exists:", !!token);
    if (token) {
      console.log(
        "🔑 Token preview (first 10 chars):",
        token.substring(0, 10) + "..."
      );
    }

    if (!token) {
      console.error("❌ No authentication token found in headers or cookies");
      return NextResponse.json(
        { error: "No authentication token found" },
        { status: 401 }
      );
    }

    const apiUrl = `${API_BASE_URL}/admin`;
    console.log("🔑 Making request to:", apiUrl);
    console.log(
      "🔑 Admin Profile - Token found, making request to /admin endpoint"
    );

    // Make request to the /admin endpoint for admin profile
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("📊 Admin Profile API Response Status:", response.status);
    console.log(
      "📊 Admin Profile API Response Headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Admin Profile API Error Status:", response.status);
      console.error("❌ Admin Profile API Error Text:", errorText);
      return NextResponse.json(
        { error: `Admin profile request failed: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ Admin Profile Success:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Admin profile route error:", error);
    console.error("❌ Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : typeof error,
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
