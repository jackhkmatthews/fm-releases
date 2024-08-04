import { Item } from "./types";

interface ReleasesResponse {
  items: Item[];
  nextCursor: string;
}

interface Variables {
  limit?: number;
  cursor?: string;
}

export async function getReleases({ limit = 10, cursor }: Variables = {}) {
  const searchParams = new URLSearchParams({
    limit: limit.toString(),
  });
  if (cursor) {
    searchParams.set("cursor", cursor);
  }
  const releaseResponse = await fetch(
    `${
      process.env.API_BASE_URL
    }/core/rpc/records.listRecordsV2?${searchParams.toString()}`
  );
  if (!releaseResponse.ok) {
    throw new Response("Failed to fetch releases", { status: 500 });
  }
  return (await releaseResponse.json()) as ReleasesResponse;
}
/**
 * TODO
 *
 * - add smaller items.publishedBy.identity.avatarUri size - loading massive image atm
 * - is there an easy way to go back? (pagination) What id I wanted `< [page] >` UI?
 *  - would be nice if returns currentCursor and maybe previousCursor?
 */
