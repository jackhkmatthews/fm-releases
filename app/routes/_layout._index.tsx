import { json, LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Form, useLoaderData, useLocation, useSubmit } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { twJoin } from "tailwind-merge";
import { z } from "zod";
import { getReleases } from "~/shared/data-fetching";
import { FMRImage } from "~/shared/fmr-image";
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
    <div className="flex flex-col">
      <div
        className={twJoin(
          shellPaddingClasses,
          "bg-gray-950 flex flex-col py-10"
        )}
      >
        <h1 className="w-full text-gray-50 font-sans leading-tight text-[max(1.875rem,8cqw)] translate-x-[-0.1ch]">
          Fresh Meta Releases
        </h1>
        <p className="text-gray-300">
          A curated selection of books, films, music and art. Released, promoted
          and distributed by{" "}
          <a
            href="https://www.metalabel.com/"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            Metalabel
          </a>
          .
        </p>
      </div>
      <div className="flex flex-col gap-4 mt-8 md:mt-12 lg:mt-16">
        <h1
          className={twJoin(
            shellPaddingClasses,
            "text-3xl w-full text-gray-900 md:text-4xl lg:text-6xl"
          )}
        >
          Releases
        </h1>
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
          <ul className="flex flex-col gap-6">
            {loaderData.data.items.map((item) => (
              <li key={item.id} className="py-4 flex flex-col gap-3">
                <div className="inline-flex items-center gap-2">
                  <FMRImage
                    height={100}
                    src={normalizeHttpsAndIpfs(
                      item.publisher.identity.avatarUri
                    )}
                    alt={item.publisher.identity.name}
                    className="w-8 h-8 rounded-lg inline-block object-cover border border-gray-200"
                  />
                  <p className="text-gray-600 break-words ">
                    Published by{" "}
                    <span className="text-black">
                      {item.publisher.identity.name}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl break-words">{item.content.name}</h2>
                  <p className="flex flex-wrap gap-1">
                    {item.recordTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-gray-600 border border-gray-600 rounded-full px-2 text-sm inline-flex"
                      >
                        {tag}
                      </span>
                    ))}
                  </p>
                </div>
                <p className="text-gray-600 break-words">
                  {item.content.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
