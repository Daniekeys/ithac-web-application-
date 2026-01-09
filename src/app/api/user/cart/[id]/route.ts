import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/utils/env";

interface RouteParams {
  params: {
    id: string;
  };
}

// Remove item from cart
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No authentication token found" },
        { status: 401 }
      );
    }

    const backendResponse = await fetch(
      `${ENV.API_URL}/user/cart/${params.id}`,
      {
        method: "DELETE",
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
          error: data.error || "Failed to remove item from cart",
        },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Remove from cart error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
