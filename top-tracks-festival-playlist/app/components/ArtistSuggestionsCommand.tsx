"use client";
import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useAppContext } from "../context/AppContext";
import { UseFormReturn } from "react-hook-form";
import { Artist, ArtistSearchForm } from "../types";

interface Props {
  form: UseFormReturn<ArtistSearchForm>;
  setIsCommandOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/*
 * 選択したアーティスト名をInputにセットする関数
 */
export const handleSelectArtist = (
  artistName: string,
  form: UseFormReturn<ArtistSearchForm>,
  setArtistSuggestions: (artistSuggestions: Artist[]) => void
) => {
  form.setValue("artistName", artistName);
  setArtistSuggestions([]);
};

const ArtistSuggestionsCommand = (props: Props) => {
  const { form, setIsCommandOpen } = props;
  const { artistSuggestions, setArtistSuggestions } = useAppContext();

  return (
    <div className="absolute z-10 mt-1 w-full bg-black border border-gray-700 rounded shadow-lg">
      <Command>
        <CommandList>
          {artistSuggestions.length > 0 ? (
            <CommandGroup>
              {artistSuggestions.map((artist) => (
                <CommandItem
                  key={artist.id}
                  onSelect={() => {
                    handleSelectArtist(artist.name, form, setArtistSuggestions);
                    setIsCommandOpen(false);
                  }}
                >
                  {artist.name}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <CommandEmpty>候補が見つかりません</CommandEmpty>
          )}
        </CommandList>
      </Command>
    </div>
  );
};

export default ArtistSuggestionsCommand;
