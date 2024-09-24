'use client';
import { useState } from 'react';
import axios from 'axios';

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
}

export default function Home() {
  const [artistId, setArtistId] = useState<string>('');
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [error, setError] = useState<string>('');

  const fetchTopTracks = async () => {
    try {
      const response = await axios.get('/api/top-tracks', {
        params: { artistId },
      });
      setTopTracks(response.data);
    } catch (error:any) {
      throw new Error('Failed to retrieve access token');
    }
  };

  return (
    <div>
      <h1>Spotify Top 10 Tracks</h1>
      <input
        type="text"
        placeholder="Enter Artist ID"
        value={artistId}
        onChange={(e) => setArtistId(e.target.value)}
      />
      <button onClick={fetchTopTracks}>Get Top Tracks</button>

      {error && <p>{error}</p>}

      <ul>
        {topTracks.map((track) => (
          <li key={track.id}>
            {track.name} - {track.artists[0].name}
          </li>
        ))}
      </ul>
    </div>
  );
}
