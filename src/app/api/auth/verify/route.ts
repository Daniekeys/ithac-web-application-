import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/utils/env";

const API_BASE_URL = ENV.API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, token } = body;

    if (!id || !token) {
        return NextResponse.json(
            { success: false, error: "Missing id or token" },
            { status: 400 }
        );
    }

    // URL: {{url}}/authentication/verify/:id
    const response = await fetch(`${API_BASE_URL}/authentication/verify/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
     console.error("Verify API error:", error);
     return NextResponse.json(
       { success: false, error: "Internal server error" },
       { status: 500 }
     );
  }
}
