import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import getAccessToken from "../../../lib/spotify";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const artistId = searchParams.get("artistId");

  if (!artistId) {
    return NextResponse.json(
      { error: "Artist ID is required" },
      { status: 400 }
    );
  }

  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          market: "JP", // 市場を指定
        },
      }
    );

    const topTracks = response.data.tracks.slice(0, 10);
    return NextResponse.json({ topTracks: topTracks }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to fetch top tracks", artistId: error },
        { status: 500 }
      );
    }
  }
}
