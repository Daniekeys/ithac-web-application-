import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Return success
    const response = NextResponse.json({ success: true, message: "Logged out" });
    
    // Clear cookie
    response.cookies.set("token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
    });
    
    return response;
  } catch (error) {
     console.error("Logout API error:", error);
     return NextResponse.json(
       { success: false, error: "Internal server error" },
       { status: 500 }
     );
  }
}
