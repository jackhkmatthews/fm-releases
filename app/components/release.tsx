import { LinkIcon } from "lucide-react";

import { FMRImage } from "~/components/fmr-image";
import { Item } from "~/types";
import { getReleaseUrl, normalizeHttpsAndIpfs } from "~/utils";

export function Release({ item }: { item: Item }) {
  return (
    <li className="flex flex-col items-start gap-3 py-4">
      <div className="inline-flex items-center gap-2">
        <FMRImage
          height={100}
          src={normalizeHttpsAndIpfs(item.publisher.identity.avatarUri)}
          alt={item.publisher.identity.name}
          className="inline-block h-8 w-8 rounded-lg border border-gray-200 object-cover"
        />
        <div className="flex flex-col">
          <p className="break-normal text-gray-600 [overflow-wrap:anywhere]">
            Published by <span className="text-black">{item.publisher.identity.name}</span>
          </p>
          <p className="text-sm text-gray-600">
            <time dateTime={item.firstPublishedAt}>{new Date(item.firstPublishedAt).toISOString().split("T")[0]}</time>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="break-normal text-2xl [overflow-wrap:anywhere]">{item.content.name}</h2>
        <p className="flex flex-wrap gap-1">
          {item.recordTags.map(tag => (
            <span key={tag} className="inline-flex rounded-full border border-gray-600 px-2 text-sm text-gray-600">
              {tag}
            </span>
          ))}
        </p>
      </div>
      <p className="break-normal text-gray-600 [overflow-wrap:anywhere]">{item.content.description}</p>
      <a
        className="inline-flex items-center gap-2 rounded-full bg-gray-800 px-3 py-1 text-gray-200 hover:text-white"
        href={getReleaseUrl(item.publisher.identity.handle, item.releasedBy[0].slug)}
        target="_blank"
        rel="noreferrer"
      >
        Learn more <LinkIcon className="h-4 w-4" />
      </a>
    </li>
  );
}
