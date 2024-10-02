import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import getAccessToken from "../../../lib/spotify";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const artistName = searchParams.get("artistName");

  if (!artistName) {
    return NextResponse.json(
      { error: "Artist Name is required" },
      { status: 400 }
    );
  }

  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        q: artistName, // クエリパラメータはparamsで指定
        type: "artist",
        market: "JP", // 市場を指定
        limit: 5,
      },
    });

    const data = response.data; // Axiosは自動でレスポンスをJSONにパースするため、`.json()`は不要

    if (data.artists.items.length > 0) {
      return NextResponse.json(
        { artists: data.artists.items },
        { status: 200 }
      ); // IDをレスポンスとして返す
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
