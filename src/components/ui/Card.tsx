import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Card({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-bg-card border border-border rounded-xl shadow-sm",
          className,
        )}
        {...props}
      />
    );
  },
);

export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function CardHeader({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn("p-6 border-b border-border", className)}
      {...props}
    />
  );
});

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4";
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle({ className, as = "h3", ...props }, ref) {
    const Tag = as as "h3";
    return (
      <Tag
        ref={ref}
        className={cn("text-xl font-semibold text-text-primary", className)}
        {...props}
      />
    );
  },
);

export const CardBody = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function CardBody({ className, ...props }, ref) {
  return <div ref={ref} className={cn("p-6", className)} {...props} />;
});

export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function CardFooter({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn("p-6 border-t border-border", className)}
      {...props}
    />
  );
});
