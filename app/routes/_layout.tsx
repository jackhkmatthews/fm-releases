import type { MetaFunction } from "@remix-run/node";
import { Link, Outlet, useLocation, useSearchParams } from "@remix-run/react";

import FilterSideMenu from "~/components/filter-side-menu";
import FMRHeader from "~/components/fmr-header";
import { cn, updateSearchParams } from "~/utils";

export const meta: MetaFunction = () => {
  return [{ title: "FMR - Releases" }, { name: "description", content: "Fresh Metalabel releases" }];
};
export default function Index() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  return (
    <div className="grid h-full w-full flex-grow grid-cols-[min-content_minmax(0,1fr)] grid-rows-[min-content_minmax(0,1fr)] pb-20">
      <aside
        className={cn(
          "sticky top-0 z-10 col-start-2 col-end-3 row-start-2 row-end-3 grid h-full max-h-screen grid-cols-[2fr,1fr] overflow-y-auto overflow-x-hidden overscroll-contain transition-transform duration-200 ease-in-out",
          searchParams.get("filterMenu") === "open" ? "translate-x-0" : "-translate-x-[110vw]",
        )}
      >
        <FilterSideMenu className="flex-grow" />
        <Link
          to={{ search: updateSearchParams(location.search, { filterMenu: "closed" }).toString() }}
          preventScrollReset
          replace
        >
          <span className="sr-only">Close</span>
        </Link>
      </aside>
      <FMRHeader className="col-start-2 row-start-1" />
      <main className="col-start-2 row-start-2">
        <Outlet />
      </main>
    </div>
  );
}
