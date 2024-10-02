import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import getAccessToken from "../../../lib/spotify";

const userId = process.env.NEXT_PUBLIC_SPOTIFY_USER_ID ?? "";

export async function POST(req: NextRequest) {
  // リクエストボディからデータを取得
  const body = await req.json();
  const playlistName = body.playlistName;

  // プレイリスト名が指定されていない場合、エラーレスポンスを返す
  if (!playlistName) {
    return NextResponse.json(
      { error: "Playlist Name is required" },
      { status: 400 }
    );
  }

  try {
    const accessToken = await getAccessToken();
    const userResponse = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userId = userResponse.data.id;

    const response = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      // `https://api.spotify.com/v1/users/me/playlists`,
      {
        name: playlistName, // クエリパラメータはparamsで指定
        public: false, // プレイリストは非公開
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data; // Axiosは自動でレスポンスをJSONにパースするため、`.json()`は不要

    if (data?.length > 0) {
      return NextResponse.json({ artistId: data }, { status: 200 }); // IDをレスポンスとして返す
    } else {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch artist data", details: error.message },
      { status: 500 }
    );
  }
}
