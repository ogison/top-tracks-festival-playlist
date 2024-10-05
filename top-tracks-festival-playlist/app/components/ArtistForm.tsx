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
import ArtistSuggestionsList from "./ArtistSuggestionsList";
import { Button } from "@/components/ui/button";
import { Artist, ArtistSearchForm, Track } from "../types";
import { z } from "zod";
import { useArtistSuggestions } from "../hooks/useArtistSuggestions ";

// バリデーションスキーマを定義
const schema = z.object({
  artistName: z
    .string()
    .min(1, { message: "アーティスト名は1文字以上入れてください" }),
});

interface ArtistFormProps {
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setTopTracks: (topTracks: any) => void;
  setIsErrorDialogOpen: (isErrorDialogOpen: boolean) => void;
  setArtistSuggestions: (artistSuggestions: Artist[]) => void;
  artistSuggestions: Artist[];
}

const ArtistForm: React.FC<ArtistFormProps> = ({
  setLoading,
  setError,
  setTopTracks,
  setIsErrorDialogOpen,
  setArtistSuggestions,
  artistSuggestions,
}) => {
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
    setError("");
    try {
      const tracks: Track[] = await fetchTopTracks(artistName);
      // 楽曲リストに追加
      await setTopTracks((prevTopTracks: Track[]) => [
        ...prevTopTracks,
        ...tracks,
      ]);
    } catch (error: any) {
      setError("楽曲の取得に失敗しました。もう一度お試しください。");
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
                  <FormLabel className="flex w-40 items-center">
                    アーティスト名
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="アーティスト名を入力してください"
                      {...field}
                    />
                  </FormControl>
                </div>

                <ArtistSuggestionsList
                  artistSuggestions={artistSuggestions}
                  form={form}
                  setArtistSuggestions={setArtistSuggestions}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">人気曲追加</Button>
        </form>
      </Form>
    </>
  );
};

export default ArtistForm;
