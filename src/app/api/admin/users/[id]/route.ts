import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const authHeader = request.headers.get("Authorization");
    
    // Try to get token from Authorization header or fallback to cookie
    const token = authHeader?.startsWith("Bearer ") 
      ? authHeader.split(" ")[1] 
      : cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No authentication token found" },
        { status: 401 }
      );
    }

    const userId = params.id;
    // Call external API: {{url}}/admin/user/:id
    const apiUrl = `${API_BASE_URL}/admin/user/${userId}`;
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
        return NextResponse.json(
            { error: `Failed to fetch user details: ${response.statusText}` },
            { status: response.status }
        );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Admin user details API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
