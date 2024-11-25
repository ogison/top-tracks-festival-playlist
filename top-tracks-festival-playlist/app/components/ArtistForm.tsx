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
import { ArtistSearchForm, Track } from "../types";
import { z } from "zod";
import { useArtistSuggestions } from "../hooks/useArtistSuggestions ";
import { Suspense, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import ArtistSuggestionsCommand from "./ArtistSuggestionsCommand";

// バリデーションスキーマを定義
const schema = z.object({
  artistName: z
    .string()
    .min(1, { message: "アーティスト名は1文字以上入れてください" }),
});

const ArtistForm = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArtistFormContent />
    </Suspense>
  );
};

const ArtistFormContent = () => {
  const {
    setLoading,
    setTopTracks,
    setIsErrorDialogOpen,
    setArtistSuggestions,
  } = useAppContext();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isCommandOpen, setIsCommandOpen] = useState<boolean>(false);
  const commandRef = useRef<HTMLDivElement>(null);

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
          className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2 mb-4"
        >
          <FormField
            control={form.control}
            name="artistName"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col md:flex-row">
                  <FormLabel className="flex w-full md:w-48 items-center mb-2 md:mb-0">
                    アーティスト名：
                  </FormLabel>
                  <div className="relative w-full" ref={commandRef}>
                    <FormControl>
                      <Input
                        placeholder="アーティスト名を入力してください"
                        className="bg-black text-green-500 font-mono"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setIsCommandOpen(e.target.value.length > 0);
                        }}
                        onFocus={() => {
                          if (field.value.length > 0) {
                            setIsCommandOpen(true);
                          }
                        }}
                      />
                    </FormControl>
                    {isCommandOpen && (
                      <>
                        <ArtistSuggestionsCommand
                          form={form}
                          setIsCommandOpen={setIsCommandOpen}
                        />
                      </>
                    )}
                  </div>
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
