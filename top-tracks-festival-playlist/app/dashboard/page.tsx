"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loading from "@/components/loading";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { artist_item } from "@/types";
import getAccessToken from "@/lib/spotify";

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
}

// バリデーションスキーマを定義
const schema = z.object({
  artistName: z
    .string()
    .min(1, { message: "アーティスト名は1文字以上入れてください" }), // 必須チェック
});

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ?? "";
const userId = process.env.NEXT_PUBLIC_SPOTIFY_USER_ID ?? "";

export default function Home() {
  const [artistId, setArtistId] = useState<string>("");
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [error, setError] = useState<string>("");

  // アーティスト候補を管理
  const [artistSuggestions, setArtistSuggestions] = useState<artist_item[]>([]);

  //　ローディングの状態を管理
  const [loading, setLoading] = useState<boolean>(false);

  // ダイアログ表示を管理
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      artistName: "",
      playlistName: "",
    },
  });

  // フォームの値を監視
  const artistName = form.watch("artistName");
  const playlistName = form.watch("playlistName");

  /*
   * 指定したアーティストの人気のTOP10曲を取得します
   */
  const fetchTopTracks = async () => {
    setLoading(true);
    setError("");
    try {
      const response1 = await axios.get("/api/get-artistid", {
        params: { artistName: artistName },
      });
      const artistId = response1.data.artistId;
      if (artistId) {
        const response2 = await axios.get("/api/top-tracks", {
          params: { artistId },
        });
        await setTopTracks(response2?.data.topTracks);
      }
    } catch (error: any) {
      setIsErrorDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  /*
   * プレイリストを作成します
   */
  const makePlaylist = async () => {
    setError("");
    try {
      const userResponse = await axios.get("/api/get-userid");
      console.log(userResponse.data.userData);
      const response = await axios.post("/api/make-playlist", {
        playlistName: playlistName,
      });

      // const response = await axios.post(
      //   `https://api.spotify.com/v1/users/${userId}/playlists`,
      //   {
      //     name: playlistName, // クエリパラメータはparamsで指定
      //     public: false, // プレイリストは非公開
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${accessToken}`,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
    } catch (error: any) {
      setIsErrorDialogOpen(true);
    }
  };

  // アーティスト検索APIを呼び出す関数
  const fetchArtistSuggestions = async () => {
    if (!artistName) return;

    const response = await axios.get("/api/get-artist-name", {
      params: { artistName: artistName },
    });

    const data = await response?.data;
    setArtistSuggestions(data.artists);
  };

  // 選択したアーティスト名をInputにセットする関数
  const handleSelectArtist = (artistName: string) => {
    form.setValue("artistName", artistName); // Inputフィールドに値をセット
    setArtistSuggestions([]); // 選択後、リストをクリア
  };

  useEffect(() => {
    if (artistName.length > 0) {
      const timeoutId = setTimeout(() => {
        try {
          // API呼び出しなどの処理
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
  }, [artistName]);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Spotify Playlist Creator</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(fetchTopTracks)}
              className="flex space-x-2 mb-4"
            >
              <FormField
                control={form.control}
                name="artistName"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex">
                      <FormLabel className="flex w-40 items-center">
                        アーティスト名
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="アーティスト名を入力してください"
                          {...field}
                        />
                      </FormControl>
                    </div>

                    {artistSuggestions?.length > 0 && (
                      <ul>
                        {artistSuggestions.map((artist) => (
                          <li
                            key={artist.id}
                            onClick={() => handleSelectArtist(artist.name)} // クリックで選択
                            style={{ cursor: "pointer", listStyle: "none" }} // ポインタを示すスタイル
                          >
                            {artist.name}
                          </li>
                        ))}
                      </ul>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">アーティスト名検索</Button>
            </form>
          </Form>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(makePlaylist)}
              className="flex space-x-2 mb-4"
            >
              <FormField
                control={form.control}
                name="playlistName"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex">
                      <FormLabel className="flex w-40 items-center">
                        プレイリスト名
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="プレイリスト名を入力してください"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">プレイリスト作成</Button>
            </form>
          </Form>
          {loading ? (
            <Loading />
          ) : (
            topTracks.length > 0 && (
              <div className="mt-4 overflow-x-auto">
                <h3 className="text-lg font-semibold mb-2">Playlist:</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">#</TableHead>
                      <TableHead>Artist</TableHead>
                      <TableHead>Song</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topTracks.map((song, index) => (
                      <TableRow
                        key={index}
                        className={index % 2 === 0 ? "bg-muted/50" : ""}
                      >
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>{song.name}</TableCell>
                        <TableCell>{song.artists[0].name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          )}
          <Dialog open={isErrorDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>認証エラー</DialogTitle>
                <DialogDescription>値を入力してください</DialogDescription>
              </DialogHeader>

              <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsErrorDialogOpen(false)}
                  >
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
