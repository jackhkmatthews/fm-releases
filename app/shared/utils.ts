import { IMAGE_BASE_URL } from "./constants";

export function normalizeHttpsAndIpfs(
  url: string,
  baseUrl: string = IMAGE_BASE_URL
) {
  if (url.startsWith("ipfs://")) {
    return `${baseUrl}/${url.slice(7)}`;
  }
  return url;
}

export function updateSearchParams(
  searchParams: string,
  changes: Record<string, string | number | undefined>
) {
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
