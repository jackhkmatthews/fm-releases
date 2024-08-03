import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { twJoin } from "tailwind-merge";
import { Star } from "~/common/icons/star";
import { shellPaddingClasses } from "~/common/styles";

export const meta: MetaFunction = () => {
  return [
    { title: "JMR Recordings - Releases" },
    { name: "description", content: "Current releases from JMR Recordings" },
  ];
};
export default function Index() {
  return (
    <div className="h-full w-full">
      <header
        className={twJoin(
          "border-b border-b-gray-200 flex justify-center h-16 items-center",
          shellPaddingClasses
        )}
      >
        <Star className="text-gray-950 h-7 w-7" />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
