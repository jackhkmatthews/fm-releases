import { LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/node";
import { isRouteErrorResponse, useLoaderData, useRouteError, useSubmit } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";

import { getReleases } from "~/shared/data-fetching";
import { largeTextClasses, shellPaddingClasses } from "~/shared/styles";
import { cn } from "~/shared/utils";

import { Hero } from "./hero";
import { Paginator } from "./paginator";
import { Release } from "./release";
import { Sorter } from "./sorter";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

const ReleasesUrlSchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional(),
  cursor: z.string().optional(),
  sortDirection: z.union([z.literal("asc"), z.literal("desc")]).optional(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const result = ReleasesUrlSchema.safeParse({
    limit: params.get("limit") || "10",
    cursor: params.get("cursor") || undefined,
    sortDirection: params.get("sortDirection") || "desc",
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
  const limitInputRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (limitInputRef.current) {
      limitInputRef.current.value = loaderData.limit || "";
    }
  }, [loaderData.limit]);

  return (
    <div className="flex flex-col">
      <Hero />
      <div className="mt-8 flex flex-col gap-4 md:mt-12 lg:mt-16">
        <h2 className={cn(shellPaddingClasses, largeTextClasses, "w-full text-gray-900")}>Releases</h2>
        <hr className="bg-gray-600" />
        <Sorter
          limit={loaderData.limit}
          sortDirection={loaderData.sortDirection}
          onSortChange={event => submit(event.currentTarget, { preventScrollReset: true })}
        />
        <hr className="bg-gray-600" />
        <Paginator
          currentCursor={loaderData.cursor}
          nextCursor={loaderData.data.nextCursor}
          limit={loaderData.limit}
          onLimitChange={event => submit(event.currentTarget, { preventScrollReset: true })}
          sortDirection={loaderData.sortDirection}
        />
        <hr className="bg-gray-600" />
        <div className={cn(shellPaddingClasses)}>
          <ul className="flex flex-col gap-10">
            {loaderData.data.items.map(item => (
              <Release key={item.id} item={item} />
            ))}
          </ul>
        </div>
        <hr className="bg-gray-600" />
        <Paginator
          preventScrollReset={false}
          currentCursor={loaderData.cursor}
          nextCursor={loaderData.data.nextCursor}
          limit={loaderData.limit}
          sortDirection={loaderData.sortDirection}
          onLimitChange={event => submit(event.currentTarget, { preventScrollReset: true })}
        />
        <hr className="bg-gray-600" />
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
