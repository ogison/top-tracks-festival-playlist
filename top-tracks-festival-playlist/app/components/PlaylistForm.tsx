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
import { useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

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
  const formRef = useRef<HTMLFormElement | null>(null);

  // プレイリスト作成後の成功ダイアログを管理
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

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
        if (track.isCheck) {
          trackUris.push(track?.uri);
        }
      });
      setError("");
      try {
        await makePlaylist(playlistName, access_token, trackUris);
        setIsSuccessDialogOpen(true);
      } catch (error: any) {
        setIsErrorDialogOpen(true);
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          ref={formRef}
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
              <Button type="button">プレイリスト作成</Button>
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
                <AlertDialogAction
                  type="button"
                  onClick={() => {
                    form.handleSubmit(handleMakePlaylist)();
                  }}
                >
                  はい
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </Form>
      <Dialog
        open={isSuccessDialogOpen}
        onOpenChange={() => setIsSuccessDialogOpen(false)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>プレイリスト作成成功</DialogTitle>
            <DialogDescription>
              プレイリストの作成に成功しました！
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsSuccessDialogOpen(false)}
              >
                閉じる
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlaylistForm;
