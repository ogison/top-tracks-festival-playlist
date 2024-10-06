import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Track } from "../types";

interface TracksListProps {
  topTracks: Track[];
}

const TracksList: React.FC<TracksListProps> = ({ topTracks }) => {
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
                <TableCell className="font-medium">{index + 1}</TableCell>
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
    </>
  );
};

export default TracksList;
