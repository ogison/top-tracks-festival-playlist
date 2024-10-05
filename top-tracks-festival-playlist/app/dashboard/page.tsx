"use client";
import { useState } from "react";
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
import { useSearchParams } from "next/navigation";
import { useArtistSuggestions } from "../hooks/useArtistSuggestions ";
import { fetchTopTracks, makePlaylist } from "../lib/spotify";
import { Artist, SearchForm, Track } from "../types";
import { handleSelectArtist } from "../handlers/handleArtist";
import ArtistSuggestionsList from "../components/ArtistSuggestionsList";

// バリデーションスキーマを定義
const schema = z.object({
  artistName: z
    .string()
    .min(1, { message: "アーティスト名は1文字以上入れてください" }),
  playlistName: z
    .string()
    .min(1, { message: "プレイリスト名は1文字以上入れてください" }),
});

export default function Home() {
  const searchParams = useSearchParams();
  const access_token = searchParams.get("access_token");
  const [error, setError] = useState<string>("");

  // 楽曲を管理
  const [topTracks, setTopTracks] = useState<Track[]>([]);

  // アーティスト候補を管理
  const [artistSuggestions, setArtistSuggestions] = useState<Artist[]>([]);

  //　ローディングの状態を管理
  const [loading, setLoading] = useState<boolean>(false);

  // ダイアログ表示を管理
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState<boolean>(false);

  // フォームの値
  const form = useForm<SearchForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      artistName: "",
      playlistName: "",
    },
  });
  const artistName = form.watch("artistName");
  const playlistName = form.watch("playlistName");

  // アーティスト検索APIを呼び出す関数
  useArtistSuggestions(artistName, setArtistSuggestions);

  /*
   * 指定したアーティストの人気のTOP10曲を取得します
   * 取得した楽曲を楽曲リストに追加します
   */
  const handleFetchTopTracks = async () => {
    setLoading(true);
    setError("");
    try {
      const tracks = await fetchTopTracks(artistName);
      // 楽曲リストに追加
      await setTopTracks((prevTracks) => [...prevTracks, ...tracks]);
    } catch (error: any) {
      setIsErrorDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  /*
   * プレイリストを作成します
   */
  const handleMakePlaylist = async () => {
    if (access_token) {
      const trackUris: string[] = [];
      topTracks.map((track) => {
        trackUris.push(track?.uri);
      });
      setError("");
      try {
        await makePlaylist(playlistName, access_token, trackUris);
      } catch (error: any) {
        setIsErrorDialogOpen(true);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Spotify Playlist Creator</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFetchTopTracks)}
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

                    <ArtistSuggestionsList
                      artistSuggestions={artistSuggestions}
                      handleSelectArtist={handleSelectArtist}
                      form={form}
                      setArtistSuggestions={setArtistSuggestions}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">人気曲追加</Button>
            </form>
          </Form>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleMakePlaylist)}
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
                      <TableHead>image</TableHead>
                      <TableHead>Song</TableHead>
                      <TableHead>Artist</TableHead>
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
                        <TableCell>
                          {/* Adding an image of the album art */}
                          {song?.album.images[0]?.url ? (
                            <img
                              src={song?.album.images[0].url}
                              alt={`${song.name} album art`}
                              className="w-[50px] h-[50px] object-cover" // Adjust the size and styling of the image
                            />
                          ) : (
                            <span>No Image</span>
                          )}
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
