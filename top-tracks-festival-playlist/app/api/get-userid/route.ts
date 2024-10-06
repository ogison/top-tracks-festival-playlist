import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  // リクエストボディからデータを取得
  const { searchParams } = new URL(req.url);
  const accessToken = searchParams.get("access_token");

  try {
    const response = await axios.get(`https://api.spotify.com/v1/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = response.data;

    return NextResponse.json({ userData: data }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to fetch artist data", details: error.message },
        { status: 500 }
      );
    }
  }
}
