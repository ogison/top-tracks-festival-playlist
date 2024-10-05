"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Artist, Track } from "../types";
import ArtistForm from "../components/ArtistForm";
import PlaylistForm from "../components/PlaylistForm";

export default function Home() {
  const [error, setError] = useState<string>("");

  // 楽曲を管理
  const [topTracks, setTopTracks] = useState<Track[]>([]);

  // アーティスト候補を管理
  const [artistSuggestions, setArtistSuggestions] = useState<Artist[]>([]);

  //　ローディングの状態を管理
  const [loading, setLoading] = useState<boolean>(false);

  // ダイアログ表示を管理
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState<boolean>(false);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Spotify Playlist Creator</CardTitle>
        </CardHeader>
        <CardContent>
          <ArtistForm
            setLoading={setLoading}
            setError={setError}
            setTopTracks={setTopTracks}
            setIsErrorDialogOpen={setIsErrorDialogOpen}
            setArtistSuggestions={setArtistSuggestions}
            artistSuggestions={artistSuggestions}
          />
          <PlaylistForm
            setError={setError}
            setIsErrorDialogOpen={setIsErrorDialogOpen}
            topTracks={topTracks}
          />
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
