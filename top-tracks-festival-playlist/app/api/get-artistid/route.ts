import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import getAccessToken from "../../../lib/spotify";
import config from "@/config/config";

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
        q: artistName,
        type: "artist",
        market: config.apiMarket,
        limit: 5,
      },
    });

    const data = response.data;

    if (data.artists.items.length > 0) {
      return NextResponse.json(
        { artistId: data.artists.items[0].id },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to fetch artist data", details: error.message },
        { status: 500 }
      );
    }
  }
}
