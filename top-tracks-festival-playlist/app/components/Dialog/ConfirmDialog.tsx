"use client";
import React, { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { UseFormReturn } from "react-hook-form";
import { PlaylistSearchForm } from "../../types";

interface Props {
  form: UseFormReturn<PlaylistSearchForm>;
  handleMakePlaylist: () => Promise<void>;
}

const ConfirmDialog = (props: Props) => {
  const { form, handleMakePlaylist } = props;
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          className={`border border-input bg-background shadow-sm ${
            isHovered ? "bg-green-400 text-black" : "bg-black"
          } hover:bg-green-400 transition-colors duration-300 pixel-font`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          プレイリスト作成
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-black text-green-500 font-mono">
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
            className={buttonVariants({ variant: "outline" })}
            onClick={() => {
              form.handleSubmit(handleMakePlaylist)();
            }}
          >
            はい
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
