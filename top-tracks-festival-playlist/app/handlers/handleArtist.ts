import { UseFormReturn } from "react-hook-form";
import { Artist, SearchForm } from "../types";

/*
 * 選択したアーティスト名をInputにセットする関数
 */
export const handleSelectArtist = (
  artistName: string,
  form: UseFormReturn<SearchForm>,
  setArtistSuggestions: (artistSuggestions: Artist[]) => void
) => {
  form.setValue("artistName", artistName);
  setArtistSuggestions([]);
};
