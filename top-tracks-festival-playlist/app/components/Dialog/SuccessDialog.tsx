"use client";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";

interface Props {
  isSuccessDialogOpen: boolean;
  setIsSuccessDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SuccessDialog = (props: Props) => {
  const { isSuccessDialogOpen, setIsSuccessDialogOpen } = props;

  return (
    <Dialog
      open={isSuccessDialogOpen}
      onOpenChange={() => setIsSuccessDialogOpen(false)}
    >
      <DialogContent className="sm:max-w-md bg-black text-green-500 font-mono">
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
              className={buttonVariants({ variant: "outline" })}
              onClick={() => setIsSuccessDialogOpen(false)}
            >
              閉じる
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
