import { json, LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Form, useLoaderData, useLocation, useSubmit } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { twJoin } from "tailwind-merge";
import { z } from "zod";
import { getReleases } from "~/shared/data-fetching";
import { JMRImage } from "~/shared/jmr-image";
import { shellPaddingClasses } from "~/shared/styles";
import { normalizeHttpsAndIpfs } from "~/shared/utils";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const ReleasesUrlSchema = z.object({
  limit: z.coerce.number().min(1).max(100),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const limit = params.get("limit") ? params.get("limit")! : "10";
  const result = ReleasesUrlSchema.safeParse({ limit });
  if (!result.success) {
    throw new Response(`Invalid query parameters.`, {
      status: 400,
    });
  }
  const data = await getReleases(result.data);
  return json({ data, limit });
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
    <div className="font-sans pt-8 flex flex-col gap-4 box-content">
      <div className={twJoin(shellPaddingClasses)}>
        <h1 className="text-3xl w-full text-gray-900 md:text-4xl lg:text-6xl py-3">
          Releases
        </h1>
        <p className="text-sm text-gray-600">
          A taste of what&apos;s to come in a size that suits you.
        </p>
      </div>
      <hr className="bg-gray-600" />
      <div className={twJoin("flex justify-between", shellPaddingClasses)}>
        <Form
          onChange={(event) => {
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
              </select>{" "}
              releases
            </label>
          </div>
        </Form>
      </div>
      <hr className="bg-gray-600" />
      <div className={twJoin(shellPaddingClasses)}>
        <ul className="flex flex-col gap-8">
          {loaderData.data.items.map((item) => (
            <li key={item.id} className="py-4 flex flex-col gap-2">
              <p className="text-gray-600 inline-flex items-center gap-2">
                <JMRImage
                  height={100}
                  src={normalizeHttpsAndIpfs(item.publisher.identity.avatarUri)}
                  alt={item.publisher.identity.name}
                  className="w-8 h-8 rounded-lg inline-block mr-2 object-cover border border-gray-200"
                />
                Published by {item.publisher.identity.name}
              </p>
              <h2 className="text-xl">{item.content.name}</h2>
              <p className="text-gray-600">{item.content.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
