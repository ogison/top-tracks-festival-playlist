import { useEffect } from "react";
import axios from "axios";
import { Artist } from "../types";

/**
 * 指定されたアーティスト名に基づいてアーティストの候補を取得するカスタムフック。
 *
 * @param {string} artistName - 検索するアーティスト名。
 * @param {(artistSuggestions: Artist[]) => void} setArtistSuggestions - アーティスト候補を管理する関数。
 */
export const useArtistSuggestions = (
  artistName: string,
  setArtistSuggestions: (artistSuggestions: Artist[]) => void
) => {
  useEffect(() => {
    if (artistName.length > 0) {
      const fetchArtistSuggestions = async () => {
        const response = await axios.get("/api/get-artist-name", {
          params: { artistName },
        });
        setArtistSuggestions(response.data.artists);
      };

      // 一定時間ごとにAPIを呼び出す
      const timeoutId = setTimeout(() => {
        try {
          fetchArtistSuggestions();
        } catch (error) {
          console.error("Error fetching artist suggestions:", error);
        } finally {
          // ここで必ずタイムアウトをクリア
          clearTimeout(timeoutId);
        }
      }, 1000); // 1000msのデバウンス

      // 前回のタイムアウトをクリアするためのクリーンアップ
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artistName]);
};
