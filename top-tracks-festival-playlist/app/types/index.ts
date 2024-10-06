export interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  uri: string;
  album: any;
  isCheck: boolean;
}

export type SearchForm = {
  artistName: string;
  playlistName: string;
};

export type ArtistSearchForm = {
  artistName: string;
};

export type PlaylistSearchForm = {
  playlistName: string;
};

export interface Artist {
  id: string;
  name: string;
}
