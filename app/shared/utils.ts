import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { IMAGE_BASE_URL } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeHttpsAndIpfs(url: string, baseUrl: string = IMAGE_BASE_URL) {
  if (url.startsWith("ipfs://")) {
    return `${baseUrl}/${url.slice(7)}`;
  }
  return url;
}

export function updateSearchParams(searchParams: string, changes: Record<string, string | number | undefined>) {
  const newSearchParams = new URLSearchParams(searchParams);
  for (const [key, value] of Object.entries(changes)) {
    if (value === undefined) {
      newSearchParams.delete(key);
      continue;
    }
    newSearchParams.set(key, String(value));
  }
  return newSearchParams;
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
