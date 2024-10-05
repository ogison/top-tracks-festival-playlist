import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { makePlaylist } from "../lib/spotify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlaylistSearchForm, Track } from "../types";
import { z } from "zod";
import { useSearchParams } from "next/navigation";

// バリデーションスキーマを定義
const schema = z.object({
  playlistName: z
    .string()
    .min(1, { message: "プレイリスト名は1文字以上入れてください" }),
});

interface PlaylistFormProps {
  setError: (error: string) => void;
  setIsErrorDialogOpen: (isErrorDialogOpen: boolean) => void;
  topTracks: Track[];
}

const PlaylistForm: React.FC<PlaylistFormProps> = ({
  setError,
  setIsErrorDialogOpen,
  topTracks,
}) => {
  const searchParams = useSearchParams();
  const access_token = searchParams.get("access_token");

  // フォームのセットアップ
  const form = useForm<PlaylistSearchForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      playlistName: "",
    },
  });
  const playlistName = form.watch("playlistName");

  /*
   * プレイリストを作成します
   */
  const handleMakePlaylist = async () => {
    if (access_token) {
      const trackUris: string[] = [];
      topTracks.map((track) => {
        trackUris.push(track?.uri);
      });
      setError("");
      try {
        await makePlaylist(playlistName, access_token, trackUris);
      } catch (error: any) {
        setIsErrorDialogOpen(true);
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleMakePlaylist)}
          className="flex space-x-2 mb-4"
        >
          <FormField
            control={form.control}
            name="playlistName"
            render={({ field }) => (
              <FormItem>
                <div className="flex">
                  <FormLabel className="flex w-40 items-center">
                    プレイリスト名
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="プレイリスト名を入力してください"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="submit">プレイリスト作成</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>プレイリストを作成しますか?</AlertDialogTitle>
                <AlertDialogDescription>
                  続行してもよろしいですか？
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction>はい</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {/* <Button type="submit">プレイリスト作成</Button> */}
        </form>
      </Form>
    </>
  );
};

export default PlaylistForm;
