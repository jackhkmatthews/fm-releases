import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { Star } from "~/shared/star";
import { shellPaddingClasses } from "~/shared/styles";

export const meta: MetaFunction = () => {
  return [
    { title: "FMR - Releases" },
    { name: "description", content: "Fresh Metalabel releases" },
  ];
};
export default function Index() {
  return (
    <div className="h-full w-full pb-20">
      <header
        className={cn(
          "border-b border-b-gray-200 flex justify-center h-16 items-center",
          shellPaddingClasses
        )}
      >
        <p className="text-xl relative font-mono">
          FMR
          <Star className="text-gray-950 h-3 w-3 absolute top-0 right-0 translate-x-full" />
        </p>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
