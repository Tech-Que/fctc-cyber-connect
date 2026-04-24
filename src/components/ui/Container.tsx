import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ContainerSize = "sm" | "md" | "lg" | "full";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
}

const sizeClasses: Record<ContainerSize, string> = {
  sm: "max-w-3xl",
  md: "max-w-6xl",
  lg: "max-w-7xl",
  full: "",
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  function Container({ className, size = "md", ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto px-4 sm:px-6 lg:px-8",
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);
