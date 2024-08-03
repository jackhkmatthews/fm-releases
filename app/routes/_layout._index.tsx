import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { twJoin } from "tailwind-merge";
import { getReleases } from "~/common/data-fetching";
import { shellPaddingClasses } from "~/common/styles";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader() {
  const data = await getReleases();
  return json({ data });
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const numberOfReleases = loaderData.data.items.length;
  return (
    <div className="font-sans pt-8 flex flex-col gap-4 box-content">
      <h1
        className={twJoin(
          "text-3xl w-full text-gray-900 md:text-4xl lg:text-6xl py-3",
          shellPaddingClasses
        )}
      >
        Releases
      </h1>
      <hr />
      <div className={twJoin(shellPaddingClasses)}>
        <p>
          We have at least{" "}
          <strong>
            {numberOfReleases} release
            {numberOfReleases > 1 ? "s" : null}
          </strong>{" "}
          to show you. Check back soon for more details!
        </p>
      </div>
    </div>
  );
}
