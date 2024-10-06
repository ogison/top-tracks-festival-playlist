import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const clientId = process.env.SPOTIFY_CLIENT_ID ?? "";
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? "";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code is required" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "http://localhost:3000/api/callback", // 認証時に指定したリダイレクトURL
        client_id: clientId,
        client_secret: clientSecret,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = response.data.access_token;
    return NextResponse.json({ accessToken });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to retrieve access token",
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
