import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/utils/env";

// Proxy to backend API for user dashboard history endpoint
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
      `${ENV.API_URL}/user/dashboard/history`,
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
          error: data.error || "Failed to fetch user history",
        },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("User dashboard history error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
