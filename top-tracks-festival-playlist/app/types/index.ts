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
  artists: { name: string; external_urls: SpotifyLink }[];
  uri: string;
  album: Album;
  isCheck: boolean;
  external_urls: SpotifyLink;
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

type SpotifyLink = {
  spotify: string;
};

export interface Artist {
  id: string;
  name: string;
}
