import axios from "axios";
import { Track } from "../types";

/**
 * 指定されたアーティストの人気のTOP10曲を取得します
 *
 * @param {string} artistName - アーティスト名
 * @returns {Promise<Track[]>} - トップ10曲の配列を返します
 * @throws {Error} - エラーが発生した場合、例外をスローします
 */
export const fetchTopTracks = async (artistName: string): Promise<Track[]> => {
  try {
    // アーティストIDの取得
    const response1 = await axios.get("/api/get-artistid", {
      params: { artistName },
    });
    const artistId = response1.data.artistId;

    // トップ10曲の取得
    if (artistId) {
      const response2 = await axios.get("/api/top-tracks", {
        params: { artistId },
      });
      return response2.data.topTracks;
    }

    // アーティストが見つからない場合は空の配列を返す
    return [];
  } catch {
    throw new Error("Failed to fetch top tracks");
  }
};

/**
 * プレイリストを作成します
 *
 * @param {string} playlistName - プレイリスト名
 * @param {string} accessToken - Spotifyのアクセストークン
 * @param {string[]} trackUris - 追加するトラックのURIの配列
 * @returns {Promise<void>} - 成功した場合はvoidを返す
 * @throws {Error} - エラーが発生した場合にスローされます
 */
export const makePlaylist = async (
  playlistName: string,
  accessToken: string,
  trackUris: string[]
): Promise<void> => {
  try {
    const response = await axios.post("/api/make-playlist", {
      playlistName: playlistName,
      access_token: accessToken,
      trackUris: trackUris,
    });
    return response.data;
  } catch {
    throw new Error("Failed to create playlist");
  }
};
