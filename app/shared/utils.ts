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
