import { HTMLAttributes } from "react";

import { Star } from "~/components/star";
import { shellPaddingClasses } from "~/styles";
import { cn } from "~/utils";

export default function FMRHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <header
      className={cn(
        "flex h-16 items-center justify-center border-b border-t border-b-gray-200",
        shellPaddingClasses,
        className,
      )}
      {...rest}
    >
      <p className="relative font-mono text-xl">
        FMR
        <Star className="absolute right-0 top-0 h-3 w-3 translate-x-full text-gray-950" />
      </p>
    </header>
  );
}
