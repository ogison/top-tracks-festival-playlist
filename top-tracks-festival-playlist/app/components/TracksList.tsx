"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Track } from "../types";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface TracksListProps {
  topTracks: Track[];
  setTopTracks: (topTracks: Track[]) => void;
}

const TracksList: React.FC<TracksListProps> = ({ topTracks, setTopTracks }) => {
  const [isHoveringSelectAll, setIsHoveringSelectAll] =
    useState<boolean>(false);
  const [isHoveringDeselectAll, setIsHoveringDeselectAll] =
    useState<boolean>(false);
  const [isHoveringDeleteAll, setIsHoveringDeleteAll] =
    useState<boolean>(false);

  // チェックがついている曲の個数
  const [songCount, setSongCount] = useState<number>(0);

  /*
   * チェックボックスを更新します
   */
  const handleCheckboxChange = (index: number) => {
    const track = topTracks[index];
    const updatedTrack = { ...track, isCheck: !track.isCheck };
    const updatedTracks = [...topTracks];
    updatedTracks[index] = updatedTrack;

    setTopTracks(updatedTracks);
  };

  /*
   * 全てのチェックボックスをチェックがある状態に更新します
   */
  const handleSelectAll = () => {
    const updatedTrackList = topTracks.map((track) => ({
      ...track,
      isCheck: true,
    }));

    setTopTracks(updatedTrackList);
  };

  /*
   * 全てのチェックボックスをチェックがない状態に更新します
   */
  const handleDeSelectAll = () => {
    const updatedTrackList = topTracks.map((track) => ({
      ...track,
      isCheck: false,
    }));

    setTopTracks(updatedTrackList);
  };

  useEffect(() => {
    setSongCount(topTracks.filter((track) => track.isCheck).length);
  }, [topTracks]);

  return (
    <>
      <div className="mt-4 overflow-x-auto">
        <Card>
          <CardHeader>
            <CardTitle>Song Lists:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Button
                type="button"
                className={`border border-input bg-background shadow-sm ${
                  isHoveringSelectAll ? "bg-green-400 text-black" : "bg-black"
                } hover:bg-green-400 transition-colors duration-300 pixel-font`}
                onClick={handleSelectAll}
                onMouseEnter={() => setIsHoveringSelectAll(true)}
                onMouseLeave={() => setIsHoveringSelectAll(false)}
              >
                全選択
              </Button>
              <Button
                type="button"
                className={`border border-input bg-background ml-2 shadow-sm ${
                  isHoveringDeselectAll ? "bg-green-400 text-black" : "bg-black"
                } hover:bg-green-400 transition-colors duration-300 pixel-font`}
                variant="secondary"
                onClick={handleDeSelectAll}
                onMouseEnter={() => setIsHoveringDeselectAll(true)}
                onMouseLeave={() => setIsHoveringDeselectAll(false)}
              >
                全解除
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    className={`border border-input bg-background ml-2 shadow-sm ${
                      isHoveringDeleteAll
                        ? "bg-green-400 text-black"
                        : "bg-black"
                    } hover:bg-green-400 transition-colors duration-300 pixel-font`}
                    onMouseEnter={() => setIsHoveringDeleteAll(true)}
                    onMouseLeave={() => setIsHoveringDeleteAll(false)}
                  >
                    全削除
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-black text-green-500 font-mono">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      本当に曲リストの中の曲をすべて削除してもよろしいですか？
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction
                      type="button"
                      className={buttonVariants({ variant: "outline" })}
                      onClick={() => {
                        setTopTracks([]);
                      }}
                    >
                      はい
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="text-right underline">全{songCount}件</div>
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
                    <TableCell>
                      <Checkbox
                        checked={song.isCheck}
                        onCheckedChange={() => handleCheckboxChange(index)}
                      />
                    </TableCell>
                    <TableCell>
                      {song?.album.images[0]?.url ? (
                        <a
                          href={song?.external_urls?.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image
                            src={song?.album.images[0].url}
                            width={Number(song?.album.images[0].width)}
                            height={Number(song?.album.images[0].height)}
                            alt={`${song.name} album art`}
                            className="w-[50px] h-[50px] object-cover" // Adjust the size and styling of the image
                          />
                        </a>
                      ) : (
                        <span>No Image</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <a
                        href={song?.external_urls?.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {song.name}{" "}
                      </a>
                    </TableCell>
                    <TableCell>
                      <a
                        href={song?.artists[0]?.external_urls?.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {song.artists[0].name}
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TracksList;
