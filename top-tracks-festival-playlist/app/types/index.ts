export interface Images {
  url: string;
  width: string;
  height: string;
}

export interface Album {
  images: Images[];
}

export interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  uri: string;
  album: Album;
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
