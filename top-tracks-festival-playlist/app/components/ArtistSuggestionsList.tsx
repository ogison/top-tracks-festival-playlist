import React from "react";
import { Artist, SearchForm } from "../types";
import { UseFormReturn } from "react-hook-form";

interface ArtistSuggestionsListProps {
  artistSuggestions: Artist[];
  handleSelectArtist: (
    artistName: string,
    form: UseFormReturn<SearchForm>,
    setArtistSuggestions: (artistSuggestions: Artist[]) => void
  ) => void;
  form: UseFormReturn<SearchForm>;
  setArtistSuggestions: (artistSuggestions: Artist[]) => void;
}

/*
 * アーテイスト候補を表示
 */
const ArtistSuggestionsList: React.FC<ArtistSuggestionsListProps> = ({
  artistSuggestions,
  handleSelectArtist,
  form,
  setArtistSuggestions,
}) => {
  return (
    <>
      {artistSuggestions?.length > 0 && (
        <ul>
          {artistSuggestions.map((artist) => (
            <li
              key={artist.id}
              onClick={() =>
                handleSelectArtist(artist.name, form, setArtistSuggestions)
              }
              style={{ cursor: "pointer", listStyle: "none" }}
            >
              {artist.name}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default ArtistSuggestionsList;
