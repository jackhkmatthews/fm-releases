import { json, LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useLocation,
  useRouteError,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { getReleases } from "~/shared/data-fetching";
import { largeTextClasses, shellPaddingClasses } from "~/shared/styles";
import { Hero } from "./hero";
import { Paginator } from "./paginator";
import { Release } from "./release";
import { cn } from "~/lib/utils";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const ReleasesUrlSchema = z.object({
  limit: z.coerce.number().min(1).max(100),
  cursor: z.string().optional(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const limit = params.get("limit") ? params.get("limit")! : "10";
  const cursor = params.get("cursor") || undefined;
  const result = ReleasesUrlSchema.safeParse({ limit, cursor });
  if (!result.success) {
    throw new Response(`Invalid query parameters. ${result.error}`, {
      status: 400,
    });
  }
  const data = await getReleases(result.data);
  return json({ data, limit, cursor });
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const location = useLocation();
  const limitInputRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (limitInputRef.current) {
      limitInputRef.current.value = loaderData.limit || "";
    }
  }, [loaderData.limit]);

  return (
    <div className="flex flex-col">
      <Hero />
      <div className="flex flex-col gap-4 mt-8 md:mt-12 lg:mt-16">
        <h2
          className={cn(
            shellPaddingClasses,
            largeTextClasses,
            "w-full text-gray-900"
          )}
        >
          Releases
        </h2>
        <hr className="bg-gray-600" />
        <div
          className={cn(
            "flex justify-between items-center flex-wrap",
            shellPaddingClasses
          )}
        >
          <Form
            className="py-1"
            onChange={(event) => {
              // TODO(jack.matthews): should we also reset the cursors / pagination here?
              submit(event.currentTarget);
            }}
            action={location.pathname}
          >
            <div>
              <label htmlFor="limit">
                Show me{" "}
                <select
                  name="limit"
                  id="limit"
                  ref={limitInputRef}
                  defaultValue={loaderData.limit || "10"}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </label>
            </div>
          </Form>
          <Paginator
            currentCursor={loaderData.cursor}
            nextCursor={loaderData.data.nextCursor}
          />
        </div>
        <hr className="bg-gray-600" />
        <div className={cn(shellPaddingClasses)}>
          <ul className="flex flex-col gap-10">
            {loaderData.data.items.map((item) => (
              <Release key={item.id} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <div className={cn(shellPaddingClasses, "py-20 flex flex-col gap-2")}>
      <h1 className={cn(largeTextClasses)}>
        Oops! A {isRouteErrorResponse(error) ? "server" : "client"} error
        occurred!
      </h1>
      {isRouteErrorResponse(error) && <p>{error.data}</p>}
      {error instanceof Error && <p>{error.message}</p>}
    </div>
  );
}
