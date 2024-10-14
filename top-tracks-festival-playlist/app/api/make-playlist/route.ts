import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  // リクエストボディからデータを取得
  const body = await req.json();
  const playlistName = body.playlistName;
  const accessToken = body.access_token;
  const trackUris = body.trackUris;

  // プレイリスト名が指定されていない場合、エラーレスポンスを返す
  if (!playlistName) {
    return NextResponse.json(
      { error: "Playlist Name is required" },
      { status: 400 }
    );
  }

  try {
    // ユーザIDを取得
    const userResponse = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userId = userResponse.data.id;

    // プレイリストを作成するリクエスト
    const playlistResponse = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name: playlistName,
        public: true, // プレイリストは公開
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const playlistId = playlistResponse.data.id;

    // プレイリストにトラックを追加
    if (trackUris.length > 0) {
      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          uris: trackUris,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const data = playlistResponse.data;

    if (data) {
      return NextResponse.json({ data: data }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Failed to make Playlist" },
        { status: 404 }
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Failed to make Playlist",
          details: error.message,
        },
        { status: 500 }
      );
    }
  }
}
