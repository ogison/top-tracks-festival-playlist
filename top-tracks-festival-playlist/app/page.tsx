'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Loading from '@/components/loading';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
}

export default function Home() {
  const [artistName, setArtistName] = useState<string>('');
  const [artistId, setArtistId] = useState<string>('');
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [error, setError] = useState<string>('');

  //　ローディングの状態を管理
  const [loading, setLoading] = useState<boolean>(false);

  // ダイアログ表示を管理
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState<boolean>(false);

  const fetchTopTracks = async () => {
    setLoading(true)
    setError('')
    try{
      const response1 = await axios.get('/api/get-artistid', {
        params: { artistName },
      });
      const artistId = response1.data.artistId
      if (artistId){
        const response2 = await axios.get('/api/top-tracks', {
          params: {artistId },
        });
        await setTopTracks(response2.data);
      }
    } catch (error:any) {
      setIsErrorDialogOpen(true); 
    } finally{
      setLoading(false)
    }
  };

  useEffect(() =>{
    console.log(isErrorDialogOpen);
    
  }, [isErrorDialogOpen]);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Spotify Playlist Creator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Enter artist name"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
            />
            <Button onClick={fetchTopTracks}>Get Top Tracks</Button>
          </div>
          {
            loading ? <Loading /> :
            (topTracks.length > 0 && (
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
                      <TableRow key={index} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{song.name}</TableCell>
                        <TableCell>{song.artists[0].name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))
          }
          <Dialog open={isErrorDialogOpen} onClose={() => setIsErrorDialogOpen(false)}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>認証エラー</DialogTitle>
                <DialogDescription>
                  値を入力してください
                </DialogDescription>
              </DialogHeader>
            
              <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                  <Button type="button" variant="secondary" onClick={() => setIsErrorDialogOpen(false)}>
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
