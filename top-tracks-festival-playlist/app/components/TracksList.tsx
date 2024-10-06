import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Track } from "../types";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

interface TracksListProps {
  topTracks: Track[];
  setTopTracks: (topTracks: Track[]) => void;
}

const TracksList: React.FC<TracksListProps> = ({ topTracks, setTopTracks }) => {
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

  return (
    <>
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
                <TableCell>
                  <Checkbox
                    checked={song.isCheck}
                    onCheckedChange={() => handleCheckboxChange(index)}
                  />
                </TableCell>
                <TableCell>
                  {song?.album.images[0]?.url ? (
                    <Image
                      src={song?.album.images[0].url}
                      width={Number(song?.album.images[0].width)}
                      height={Number(song?.album.images[0].height)}
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
    </>
  );
};

export default TracksList;
