"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import TracksList from "../components/TracksList";

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
              <TracksList topTracks={topTracks} setTopTracks={setTopTracks} />
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
