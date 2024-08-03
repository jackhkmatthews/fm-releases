import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { twJoin } from "tailwind-merge";
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

export async function loader() {
  const data = await getReleases();
  return json({ data });
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <div className="font-sans pt-8 flex flex-col gap-4 box-content">
      <div className={twJoin(shellPaddingClasses)}>
        <h1 className="text-3xl w-full text-gray-900 md:text-4xl lg:text-6xl py-3">
          Featured releases
        </h1>
        <p className="text-gray-600">A small taste of what&apos;s to come</p>
      </div>
      <hr />
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
