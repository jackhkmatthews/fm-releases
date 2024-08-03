import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { Star } from "~/common/icons/star";

export const meta: MetaFunction = () => {
  return [
    { title: "JMR Recordings - Releases" },
    { name: "description", content: "Current releases from JMR Recordings" },
  ];
};
export default function Index() {
  return (
    <div className="h-full w-full">
      <header className="border-b border-b-gray-200 flex justify-center h-16 items-center px-3">
        <Star className="text-gray-950 h-7 w-7" />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
