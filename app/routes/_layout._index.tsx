import { LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useLocation,
  useRouteError,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { Plus } from "lucide-react";
import { useEffect, useRef } from "react";
import { z } from "zod";

import { Hero } from "~/components/hero";
import { Paginator } from "~/components/paginator";
import { Release } from "~/components/release";
import { Sorter } from "~/components/sorter";
import { TAGS } from "~/constants";
import { getReleases } from "~/data-fetching";
import { largeTextClasses, noScrollBar, queryCTAClasses, shellPaddingClasses } from "~/styles";
import { cn, updateSearchParams } from "~/utils";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

const ReleasesUrlSchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional(),
  cursor: z.string().optional(),
  sortDirection: z.union([z.literal("asc"), z.literal("desc")]).optional(),
  recordTagIn: z.string().optional(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const tags = params.getAll("tag");
  const result = ReleasesUrlSchema.safeParse({
    limit: params.get("limit") || "10",
    cursor: params.get("cursor") || undefined,
    sortDirection: params.get("sortDirection") || "desc",
    recordTagIn: tags.join(","),
  });
  if (!result.success) {
    throw new Response(`Invalid query parameters. ${result.error}`, {
      status: 400,
    });
  }
  const data = await getReleases(result.data);
  return json({ data, ...result.data, limit: String(result.data.limit) });
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const [, setSearchParams] = useSearchParams();
  const location = useLocation();
  const limitInputRef = useRef<HTMLSelectElement>(null);
  const tags = (loaderData.recordTagIn?.split(",") || []).map(tag => TAGS.find(t => t.value === tag)!).filter(Boolean);

  useEffect(() => {
    if (limitInputRef.current) {
      limitInputRef.current.value = loaderData.limit || "";
    }
  }, [loaderData.limit]);

  return (
    <div className="flex flex-col">
      <Hero />
      <div className="mt-8 flex flex-col md:mt-12 lg:mt-16">
        <h2 className={cn(shellPaddingClasses, largeTextClasses, "w-full border-b border-gray-300 pb-4 text-gray-900")}>
          Releases
        </h2>
        <div
          className={cn(
            "flex items-center justify-start gap-2 overflow-x-scroll border-b border-gray-300 py-2",
            shellPaddingClasses,
            noScrollBar,
          )}
        >
          <Sorter
            className="flex-shrink-0"
            sortDirection={loaderData.sortDirection}
            onSortChange={event => {
              const formData = new FormData(event.currentTarget);
              setSearchParams(searchParams => {
                searchParams.set("sortDirection", formData.get("sortDirection") as string);
                return searchParams;
              });
            }}
          />

          {tags.length > 0 &&
            tags.map(tag => (
              <p key={tag.value} className={cn(queryCTAClasses, "pr-2")}>
                <span>{tag.label}</span>
              </p>
            ))}
          <Link
            to={{ search: updateSearchParams(location.search, { filterMenu: "open" }).toString() }}
            preventScrollReset
            className={cn(queryCTAClasses, "flex-shrink-0")}
          >
            Update filters
            <Plus className="h-4 w-4 opacity-50" />
          </Link>
        </div>
        <Paginator
          className="border-b border-gray-300 py-2"
          currentCursor={loaderData.cursor}
          nextCursor={loaderData.data.nextCursor}
          limit={loaderData.limit}
          onLimitChange={event => submit(event.currentTarget, { preventScrollReset: true })}
          sortDirection={loaderData.sortDirection}
        />
        <div className={cn(shellPaddingClasses, "border-b border-gray-300 py-4")}>
          <ul className="flex flex-col gap-10">
            {loaderData.data.items.map(item => (
              <Release key={item.id} item={item} />
            ))}
          </ul>
        </div>
        <Paginator
          className="border-b border-gray-300 py-4"
          preventScrollReset={false}
          currentCursor={loaderData.cursor}
          nextCursor={loaderData.data.nextCursor}
          limit={loaderData.limit}
          sortDirection={loaderData.sortDirection}
          onLimitChange={event => submit(event.currentTarget, { preventScrollReset: true })}
        />
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <div className={cn(shellPaddingClasses, "flex flex-col gap-2 py-20")}>
      <h1 className={cn(largeTextClasses)}>
        Oops! A {isRouteErrorResponse(error) ? "server" : "client"} error occurred!
      </h1>
      {isRouteErrorResponse(error) && <p>{error.data}</p>}
      {error instanceof Error && <p>{error.message}</p>}
    </div>
  );
}
