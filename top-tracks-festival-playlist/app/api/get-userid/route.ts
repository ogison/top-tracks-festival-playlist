import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import getAccessToken from "../../../lib/spotify";

export async function GET(req: NextRequest) {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(`https://api.spotify.com/v1/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = response.data;

    return NextResponse.json({ userData: data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch artist data", details: error.message },
      { status: 500 }
    );
  }
}
