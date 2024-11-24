"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/loading";
import ArtistForm from "../components/ArtistForm";
import PlaylistForm from "../components/PlaylistForm";
import TracksList from "../components/TracksList";
import SpotifyLogo from "../components/SpotifyLogo";
import ErrorDialog from "../components/Dialog/ErrorDialog";
import { useAppContext } from "../context/AppContext";

export default function Home() {
  const { topTracks, loading } = useAppContext();

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row md:items-center">
          <Card className="w-full md:w-2/3">
            <CardHeader>
              <CardTitle>PLAYLISTER X</CardTitle>
            </CardHeader>
            <CardContent>
              <ArtistForm />
              <PlaylistForm />
            </CardContent>
          </Card>
          <div className="ml-auto">
            <SpotifyLogo />
          </div>
        </div>

        {loading ? <Loading /> : topTracks.length > 0 && <TracksList />}
        <ErrorDialog />
      </div>
    </div>
  );
}
