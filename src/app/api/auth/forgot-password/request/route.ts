import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/utils/env";

const API_BASE_URL = ENV.API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // URL: {{url}}/authentication/forgot/request/
    const response = await fetch(`${API_BASE_URL}/authentication/forgot/request/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
     console.error("Forgot Password Request API error:", error);
     return NextResponse.json(
       { success: false, error: "Internal server error" },
       { status: 500 }
     );
  }
}
