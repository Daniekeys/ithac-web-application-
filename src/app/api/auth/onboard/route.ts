import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/utils/env";

const API_BASE_URL = ENV.API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get token from cookie (httpOnly)
    const token = request.cookies.get("token")?.value;
    
    if (!token) {
        return NextResponse.json(
            { success: false, error: "Unauthorized" },
            { status: 401 }
        );
    }

    // URL: {{url}}/authentication/onboard
    const response = await fetch(`${API_BASE_URL}/authentication/onboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    // If response updates user object, we might want to return it.
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
     console.error("Onboard API error:", error);
     return NextResponse.json(
       { success: false, error: "Internal server error" },
       { status: 500 }
     );
  }
}
