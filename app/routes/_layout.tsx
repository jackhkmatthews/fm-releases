import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { cn } from "~/lib/utils";
import { Star } from "~/shared/star";
import { shellPaddingClasses } from "~/shared/styles";

export const meta: MetaFunction = () => {
  return [{ title: "FMR - Releases" }, { name: "description", content: "Fresh Metalabel releases" }];
};
export default function Index() {
  return (
    <div className="h-full w-full pb-20">
      <header className={cn("flex h-16 items-center justify-center border-b border-b-gray-200", shellPaddingClasses)}>
        <p className="relative font-mono text-xl">
          FMR
          <Star className="absolute right-0 top-0 h-3 w-3 translate-x-full text-gray-950" />
        </p>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
