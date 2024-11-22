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
import { useAppContext } from "../context/AppContext";

const ErrorDialog = () => {
  const { isErrorDialogOpen, errorMessage, setIsErrorDialogOpen } =
    useAppContext();

  return (
    <Dialog open={isErrorDialogOpen}>
      <DialogContent className="sm:max-w-[425px] bg-black text-green-500 font-mono">
        <DialogHeader>
          <DialogTitle>エラー</DialogTitle>
          <DialogDescription>{errorMessage}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              className={buttonVariants({ variant: "outline" })}
              variant="secondary"
              onClick={() => setIsErrorDialogOpen(false)}
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorDialog;
