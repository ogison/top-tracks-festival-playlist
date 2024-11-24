"use client";
import React, { forwardRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  handleAction?: () => void;
  name: string;
}

const CustomButton = forwardRef<HTMLButtonElement, Props>(
  ({ handleAction, name }, ref) => {
    const [isHovering, setIsHovering] = useState<boolean>(false);

    return (
      <Button
        ref={ref}
        type="button"
        className={`border border-input bg-background shadow-sm ${
          isHovering ? "bg-green-400 text-black" : "bg-black"
        } hover:bg-green-400 transition-colors duration-300 pixel-font`}
        onClick={handleAction}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {name}
      </Button>
    );
  }
);

CustomButton.displayName = "CustomButton";

export default CustomButton;
