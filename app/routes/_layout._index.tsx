import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useNavigation,
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
import { getReleases } from "~/data-fetching";
import { CTAClasses, largeTextClasses, noScrollBar, shellPaddingClasses } from "~/styles";
import { cn, getCheckedTags } from "~/utils";

const ReleasesUrlSchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional(),
  cursor: z.string().optional(),
  sortDirection: z.union([z.literal("asc"), z.literal("desc")]).optional(),
  recordTagIn: z.string().optional(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const tags = params.getAll("tag").join(",");
  const result = ReleasesUrlSchema.safeParse({
    limit: params.get("limit") || "10",
    cursor: params.get("cursor") || undefined,
    sortDirection: params.get("sortDirection") || "desc",
    recordTagIn: tags || undefined,
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
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const limitInputRef = useRef<HTMLSelectElement>(null);
  const submit = useSubmit();
  const checkedTags = getCheckedTags(searchParams);

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
              submit(event.currentTarget, { preventScrollReset: true });
            }}
          />

          {checkedTags.length > 0 &&
            checkedTags.map(tag => (
              <p key={tag.value} className={cn(CTAClasses, "bg-gray-50 px-2")}>
                <span>{tag.label}</span>
              </p>
            ))}
          <Link
            to={{ hash: "#filter-menu-open", search: searchParams.toString() }}
            preventScrollReset
            className={cn(CTAClasses, "flex-shrink-0 pl-2")}
          >
            Update filters
            <Plus className="h-4 w-4 opacity-50" />
          </Link>
        </div>
        <Paginator
          className="border-b border-gray-300"
          currentCursor={loaderData.cursor}
          nextCursor={loaderData.data.nextCursor}
          limit={loaderData.limit}
        />
        <div
          className={cn(
            shellPaddingClasses,
            "border-b border-gray-300 py-4 lg:py-10",
            navigation.state === "loading" && "animate-pulse",
          )}
        >
          <ul className="flex flex-col gap-10 lg:gap-20">
            {loaderData.data.items.map(item => (
              <Release key={item.id} item={item} />
            ))}
          </ul>
        </div>
        <Paginator
          className="border-b border-gray-300"
          preventScrollReset={false}
          currentCursor={loaderData.cursor}
          nextCursor={loaderData.data.nextCursor}
          limit={loaderData.limit}
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
