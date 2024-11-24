"use client";
import React, { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAppContext } from "@/app/context/AppContext";

const DeleteConfirmDialog = () => {
  const { setTopTracks } = useAppContext();
  const [isHoveringDeleteAll, setIsHoveringDeleteAll] =
    useState<boolean>(false);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          className={`border border-input bg-background ml-2 shadow-sm ${
            isHoveringDeleteAll ? "bg-green-400 text-black" : "bg-black"
          } hover:bg-green-400 transition-colors duration-300 pixel-font`}
          onMouseEnter={() => setIsHoveringDeleteAll(true)}
          onMouseLeave={() => setIsHoveringDeleteAll(false)}
        >
          全削除
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-black text-green-500 font-mono">
        <AlertDialogHeader>
          <AlertDialogTitle>
            本当に曲リストの中の曲をすべて削除してもよろしいですか？
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            type="button"
            className={buttonVariants({ variant: "outline" })}
            onClick={() => {
              setTopTracks([]);
            }}
          >
            はい
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
