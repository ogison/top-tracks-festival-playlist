"use client";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
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
import SpotifyLogo from "../components/SpotifyLogo";

export default function Home() {
  // 楽曲を管理
  const [topTracks, setTopTracks] = useState<Track[]>([]);

  // アーティスト候補を管理
  const [artistSuggestions, setArtistSuggestions] = useState<Artist[]>([]);

  //　ローディングの状態を管理
  const [loading, setLoading] = useState<boolean>(false);

  // ダイアログ表示を管理
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row md:items-center">
          <Card className="w-full md:w-2/3">
            <CardHeader>
              <CardTitle>PLAYLISTER X</CardTitle>
            </CardHeader>
            <CardContent>
              <ArtistForm
                setLoading={setLoading}
                setTopTracks={setTopTracks}
                setIsErrorDialogOpen={setIsErrorDialogOpen}
                setArtistSuggestions={setArtistSuggestions}
                artistSuggestions={artistSuggestions}
              />
              <PlaylistForm
                setIsErrorDialogOpen={setIsErrorDialogOpen}
                topTracks={topTracks}
                setErrorMessage={setErrorMessage}
              />
            </CardContent>
          </Card>
          <div className="ml-auto">
            <SpotifyLogo />
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : (
          topTracks.length > 0 && (
            <TracksList topTracks={topTracks} setTopTracks={setTopTracks} />
          )
        )}
        <Dialog open={isErrorDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-black text-green-500 font-mono">
            <DialogHeader>
              <DialogTitle>エラー</DialogTitle>
              <DialogDescription>{errorMessage}</DialogDescription>
            </DialogHeader>

            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button
                  type="button"
                  className={buttonVariants({ variant: "outline" })}
                  variant="secondary"
                  onClick={() => setIsErrorDialogOpen(false)}
                >
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
