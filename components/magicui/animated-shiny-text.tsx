import { ComponentPropsWithoutRef, CSSProperties, FC } from "react";

import { cn } from "@/lib/utils";

export interface AnimatedShinyTextProps
  extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number;
  hover?: boolean;
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  hover = false,
  className,
  shimmerWidth = 100,
  ...props
}) => {
  return (
    <span
      style={
        {
          "--shiny-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={
        hover ? cn(
          "mx-auto max-w-md text-neutral-600/70 dark:text-neutral-400/70",

          // Only activate shine on hover
          "hover:animate-shiny-text hover:bg-clip-text hover:bg-no-repeat hover:[background-position:0_0] hover:[background-size:var(--shiny-width)_100%] hover:[transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",

          // Shine gradient (only apply when hovered too)
          "hover:bg-gradient-to-r hover:from-transparent hover:via-black/80 hover:via-50% hover:to-transparent hover:dark:via-white/80",

          className
        ) :
        cn(
        "mx-auto max-w-md text-neutral-600/70 dark:text-neutral-400/70",

        // Shine effect
        "animate-shiny-text bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",

        // Shine gradient
        "bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent  dark:via-white/80",

        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
