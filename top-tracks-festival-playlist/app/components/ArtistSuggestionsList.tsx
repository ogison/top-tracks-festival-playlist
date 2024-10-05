import React from "react";
import { Artist, ArtistSearchForm } from "../types";
import { UseFormReturn } from "react-hook-form";
import { handleSelectArtist } from "../handlers/handleArtist";

interface ArtistSuggestionsListProps {
  artistSuggestions: Artist[];
  form: UseFormReturn<ArtistSearchForm>;
  setArtistSuggestions: (artistSuggestions: Artist[]) => void;
}

/*
 * アーテイスト候補を表示
 */
const ArtistSuggestionsList: React.FC<ArtistSuggestionsListProps> = ({
  artistSuggestions,
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
