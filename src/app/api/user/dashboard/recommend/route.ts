import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/utils/env";

// Proxy to backend API for user dashboard recommend endpoint
export async function GET(req: NextRequest) {
  try {
    // Extract the token from Authorization header or cookies
    let token;
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    } else {
        token = req.cookies.get("token")?.value;
    }

    console.log("[API Proxy] /user/dashboard/recommend - Token found:", !!token);

    /*
    if (!token) {
      return NextResponse.json(
        { success: false, error: "No authentication token found" },
        { status: 401 }
      );
    }
    */

    // Forward the request to the backend API
    const backendResponse = await fetch(
      `${ENV.API_URL}/user/dashboard/recommended`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("[API Proxy] Backend response status:", backendResponse.status);

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || "Failed to fetch recommended courses",
          action: data.action,
        },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("User dashboard recommend error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
