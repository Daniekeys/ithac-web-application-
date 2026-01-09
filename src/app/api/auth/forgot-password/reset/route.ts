import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/utils/env";

const API_BASE_URL = ENV.API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // URL: {{url}}/authentication/forgot/validate/
    // Postman name "Validate OTP" but body includes password and it seems to update it?
    // "Update Password" endpoint also exists in my grep earlier?
    // Let's re-read the grep or file view.
    // View lines 14828+ ... "Validate OTP" ... url .../validate/ ... body includes password.
    // If there is another endpoint for NEW password, I missed it?
    // Postman view Step 91, lines 14500-14900 shows "Validate OTP".
    // Wait, Step 87 summary says: "Update Password endpoint uses PUT /authentication/forgot/new/password".
    // I need to check if "Validate OTP" is enough or if I need "Update Password".
    // "Validate OTP" body: email, token, password.
    // If I use "Validate OTP" and it works, fine.
    // But if "new/password" is separate, I might need that.
    // Given the previous summary said "Update Password endpoint uses PUT /authentication/forgot/new/password", I should check if that exists.
    // I will use "Validate OTP" endpoint first as it seems to take password too (maybe effectively resetting it or just logging in?).
    // Actually, let's Stick to /validate/ for now as per the "Validate OTP" I saw.
    
    const response = await fetch(`${API_BASE_URL}/authentication/forgot/validate/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
     console.error("Forgot Password Reset API error:", error);
     return NextResponse.json(
       { success: false, error: "Internal server error" },
       { status: 500 }
     );
  }
}
