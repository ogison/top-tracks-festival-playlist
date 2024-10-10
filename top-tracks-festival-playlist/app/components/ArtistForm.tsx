"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { fetchTopTracks } from "../lib/spotify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Artist, ArtistSearchForm, Track } from "../types";
import { z } from "zod";
import { useArtistSuggestions } from "../hooks/useArtistSuggestions ";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleSelectArtist } from "../handlers/handleArtist";

// バリデーションスキーマを定義
const schema = z.object({
  artistName: z
    .string()
    .min(1, { message: "アーティスト名は1文字以上入れてください" }),
});

interface ArtistFormProps {
  setLoading: (loading: boolean) => void;
  setTopTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  setIsErrorDialogOpen: (isErrorDialogOpen: boolean) => void;
  setArtistSuggestions: (artistSuggestions: Artist[]) => void;
  artistSuggestions: Artist[];
}

const ArtistForm: React.FC<ArtistFormProps> = ({
  setLoading,
  setTopTracks,
  setIsErrorDialogOpen,
  setArtistSuggestions,
  artistSuggestions,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // フォームのセットアップ
  const form = useForm<ArtistSearchForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      artistName: "",
    },
  });
  const artistName = form.watch("artistName");

  // アーティスト検索APIを呼び出す関数
  useArtistSuggestions(artistName, setArtistSuggestions);

  /*
   * 指定したアーティストの人気のTOP10曲を取得し、リストに追加
   */
  const handleFetchTopTracks = async () => {
    setLoading(true);
    try {
      const tracks: Track[] = (await fetchTopTracks(artistName)).map(
        (track) => ({ ...track, isCheck: true })
      );
      // 楽曲リストに追加
      await setTopTracks((prevTopTracks: Track[]) => [
        ...prevTopTracks,
        ...tracks,
      ]);
    } catch {
      setIsErrorDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFetchTopTracks)}
          className="flex space-x-2 mb-4"
        >
          <FormField
            control={form.control}
            name="artistName"
            render={({ field }) => (
              <FormItem>
                <div className="flex">
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <div className="flex">
                          <FormLabel className="flex w-48 items-center">
                            アーティスト名：
                          </FormLabel>
                          <Input
                            className=" bg-black text-green-500 font-mono"
                            placeholder="アーティスト名を入力してください"
                            {...field}
                          />
                        </div>
                      </DropdownMenuTrigger>
                      {artistSuggestions?.length > 0 && (
                        <DropdownMenuContent className=" bg-black text-green-500 font-mon">
                          <>
                            {artistSuggestions.map((artist) => (
                              <DropdownMenuItem
                                key={artist.id}
                                onClick={() =>
                                  handleSelectArtist(
                                    artist.name,
                                    form,
                                    setArtistSuggestions
                                  )
                                }
                                style={{ cursor: "pointer", listStyle: "none" }}
                              >
                                {artist.name}
                              </DropdownMenuItem>
                            ))}
                          </>
                        </DropdownMenuContent>
                      )}
                    </DropdownMenu>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className={`border border-input bg-background shadow-sm ${
              isHovered ? "bg-green-400 text-black" : "bg-black"
            } hover:bg-green-400 transition-colors duration-300 pixel-font`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            人気曲追加
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ArtistForm;
