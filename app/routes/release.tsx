import { FMRImage } from "~/shared/fmr-image";
import { getReleaseUrl, normalizeHttpsAndIpfs } from "~/shared/utils";
import { LinkIcon } from "lucide-react";
import { Item } from "~/shared/types";

export function Release({ item }: { item: Item }) {
  return (
    <li className="py-4 flex flex-col gap-3 items-start">
      <div className="inline-flex items-center gap-2">
        <FMRImage
          height={100}
          src={normalizeHttpsAndIpfs(item.publisher.identity.avatarUri)}
          alt={item.publisher.identity.name}
          className="w-8 h-8 rounded-lg inline-block object-cover border border-gray-200"
        />
        <p className="text-gray-600 break-words ">
          Published by{" "}
          <span className="text-black">{item.publisher.identity.name}</span>
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
      <p className="text-gray-600 break-words">{item.content.description}</p>
      <a
        className="inline-flex items-center gap-2 rounded-full px-3 text-gray-200 bg-gray-800 py-1 hover:text-white"
        href={getReleaseUrl(
          item.publisher.identity.handle,
          item.releasedBy[0].slug
        )}
        target="_blank"
        rel="noreferrer"
      >
        Learn more <LinkIcon className="h-4 w-4" />
      </a>
    </li>
  );
}
