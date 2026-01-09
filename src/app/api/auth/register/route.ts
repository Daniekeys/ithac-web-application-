import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/utils/env";

const API_BASE_URL = ENV.API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Using the URL structure from Postman: {{url}}/authentication/register
    // Double check if it is "register" or something else.
    // My previous script found "Register" -> "url": "{{url}}/authentication/register"
    
    const response = await fetch(`${API_BASE_URL}/authentication/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    // Pass cookies if any come back (e.g. if auto-login)
    // But usually register just returns success/data
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
     console.error("Registration API error:", error);
     return NextResponse.json(
       { success: false, error: "Internal server error" },
       { status: 500 }
     );
  }
}
