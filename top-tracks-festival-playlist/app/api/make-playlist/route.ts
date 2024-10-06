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
    // アクセストークンを使って認証されたユーザーの情報を取得
    const userResponse = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userId = userResponse.data.id; // 認証されたユーザーのIDを取得

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
          uris: trackUris, // 追加するトラックのURI配列
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const data = playlistResponse.data; // Axiosは自動でレスポンスをJSONにパースするため、`.json()`は不要

    if (data) {
      return NextResponse.json({ data: data }, { status: 200 }); // IDをレスポンスとして返す
    } else {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Failed to fetch artist data",
          details: error.message,
        },
        { status: 500 }
      );
    }
  }
}
