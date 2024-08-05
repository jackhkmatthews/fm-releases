import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { IMAGE_BASE_URL, TAGS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeHttpsAndIpfs(url: string, baseUrl: string = IMAGE_BASE_URL) {
  if (url.startsWith("ipfs://")) {
    return `${baseUrl}/${url.slice(7)}`;
  }
  return url;
}

export function updateSearchParams(
  searchParams: string | URLSearchParams,
  changes: Record<string, string | number | undefined | string[]>,
) {
  const newSearchParams = typeof searchParams === "string" ? new URLSearchParams(searchParams) : searchParams;
  for (const [key, value] of Object.entries(changes)) {
    if (value === undefined) {
      newSearchParams.delete(key);
    } else if (Array.isArray(value)) {
      newSearchParams.delete(key);
      value.forEach(v => newSearchParams.append(key, v));
    } else {
      newSearchParams.set(key, String(value));
    }
  }
  return newSearchParams;
}

export function getCheckedTags(searchParams: URLSearchParams) {
  return (searchParams.getAll("tag") || []).filter(Boolean).map(tag => TAGS.find(t => t.value === tag)!);
}

export function getReleaseUrl(publisherHandle: string, releaseSlug: string) {
  return `https://${publisherHandle}.metalabel.com/${releaseSlug}`;
}

export function constructSearchParams(params: Record<string, string | undefined | number>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams;
}
