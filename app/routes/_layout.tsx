import type { MetaFunction } from "@remix-run/node";
import { Link, Outlet, useLocation, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";

import FilterSideMenu from "~/components/filter-side-menu";
import FMRHeader from "~/components/fmr-header";
import { cn } from "~/utils";

export const meta: MetaFunction = () => {
  return [{ title: "FM Releases" }, { name: "description", content: "Fresh Metalabel Releases" }];
};
export default function Index() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // TODO(jack.matthews): Prevents hydration mismatch for sidenav classnames. Maybe a better way?
  const [isClientSide, setIsClientSide] = useState(false);

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  return (
    <div className="grid h-full w-full flex-grow grid-cols-[min-content_minmax(0,1fr)] grid-rows-[min-content_minmax(0,1fr)] pb-20">
      <aside
        className={cn(
          "sticky top-0 z-10 col-start-2 col-end-3 row-start-2 row-end-3 grid h-full max-h-screen grid-cols-[2fr,1fr] overflow-y-auto overflow-x-hidden overscroll-contain transition-transform duration-200 ease-in-out md:grid-cols-[1fr,1fr] lg:grid-cols-[1fr,2fr]",
          isClientSide && location.hash === "#filter-menu-open" ? "translate-x-0" : "-translate-x-[110vw]",
        )}
      >
        <FilterSideMenu className="flex-grow" />
        <Link to={{ hash: "#", search: searchParams.toString() }} preventScrollReset replace>
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
