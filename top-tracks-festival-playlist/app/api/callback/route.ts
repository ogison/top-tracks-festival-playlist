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
  const basicAuthToken = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        // client_id: clientId,
        // client_secret: clientSecret,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basicAuthToken}`, // Basic 認証を追加
        },
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;

    // トークンをセッションやデータベースに保存する処理を実装可能
    // ここでは、クエリパラメータに付けてリダイレクトする例を示します
    // ホスト名を取得し、絶対URLにリダイレクトする
    const host = req.headers.get("host");
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const absoluteUrl = `${protocol}://${host}/dashboard?access_token=${access_token}`;

    return NextResponse.redirect(absoluteUrl);
  } catch (error: any) {
    console.error("Error Response Data:", error.response?.data);
    console.error("Error Response Status:", error.response?.status);
    console.error("Error Message:", error.message);
    console.error(
      "Spotify authentication error:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      {
        error: "Failed to authenticate with Spotify",
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
