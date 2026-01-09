import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { ENV } from "@/utils/env";

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;
    
    const token = request.cookies.get("token")?.value || request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await axios.get(`${ENV.API_URL}/user/course/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to fetch course" },
      { status: err.response?.status || 500 }
    );
  }
}
