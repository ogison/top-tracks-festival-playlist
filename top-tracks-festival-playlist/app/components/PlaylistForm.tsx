"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { makePlaylist } from "../lib/spotify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { PlaylistSearchForm } from "../types";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import { MAX_SONGS } from "../constants";
import { MESSAGE } from "../constants/message";
import { useAppContext } from "../context/AppContext";
import ConfirmDialog from "./Dialog/ConfirmDialog";
import SuccessDialog from "./Dialog/SuccessDialog";

// バリデーションスキーマを定義
const schema = z.object({
  playlistName: z
    .string()
    .min(1, { message: "プレイリスト名は1文字以上入れてください" }),
});

const PlaylistForm = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlaylistFormContent />
    </Suspense>
  );
};

const PlaylistFormContent = () => {
  const { setIsErrorDialogOpen, topTracks, setErrorMessage } = useAppContext();
  const searchParams = useSearchParams();
  const access_token = searchParams.get("access_token");
  const formRef = useRef<HTMLFormElement | null>(null);

  // プレイリスト作成後の成功ダイアログを管理
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] =
    useState<boolean>(false);

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
    console.log(topTracks.length);
    if (topTracks.length >= MAX_SONGS) {
      setIsErrorDialogOpen(true);
      setErrorMessage(MESSAGE.曲制限);
      return;
    }

    if (access_token) {
      const trackUris: string[] = [];
      topTracks.map((track) => {
        if (track.isCheck) {
          trackUris.push(track?.uri);
        }
      });
      try {
        await makePlaylist(playlistName, access_token, trackUris);
        setIsSuccessDialogOpen(true);
      } catch {
        setIsErrorDialogOpen(true);
        setErrorMessage(MESSAGE.認証エラー);
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(handleMakePlaylist)}
          className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2 mb-4"
        >
          <FormField
            control={form.control}
            name="playlistName"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col md:flex-row">
                  <FormLabel className="flex w-full md:w-48 items-center mb-2 md:mb-0">
                    プレイリスト名：
                  </FormLabel>
                  <FormControl>
                    <Input
                      className=" bg-black text-green-500 font-mono"
                      placeholder="プレイリスト名を入力してください"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <ConfirmDialog form={form} handleMakePlaylist={handleMakePlaylist} />
        </form>
      </Form>
      <SuccessDialog
        isSuccessDialogOpen={isSuccessDialogOpen}
        setIsSuccessDialogOpen={setIsSuccessDialogOpen}
      />
    </>
  );
};

export default PlaylistForm;
