import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { ENV } from "@/utils/env";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const size = searchParams.get("size") || "10";

    const query = `?page=${page}&size=${size}`;

    const token =
      request.cookies.get("token")?.value ||
      request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await axios.get(
      `${ENV.API_URL}/user/courses/subscribed${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return NextResponse.json(
      {
        error:
          err.response?.data?.message || "Failed to fetch subscribed courses",
      },
      { status: err.response?.status || 500 }
    );
  }
}
