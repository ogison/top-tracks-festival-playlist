import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!;
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET!;

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code is missing" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;

    // トークンをセッションやデータベースに保存する処理を実装可能
    // ここでは、クエリパラメータに付けてリダイレクトする例を示します
    return NextResponse.redirect(`/dashboard?access_token=${access_token}`);
  } catch (error: any) {
    console.error(
      "Spotify authentication error:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: "Failed to authenticate with Spotify" },
      { status: 500 }
    );
  }
}
