export interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  uri: string;
  album: any;
}

export type SearchForm = {
  artistName: string;
  playlistName: string;
};

export interface Artist {
  id: string;
  name: string;
}
