import { Item, SortBy, SortDirection } from "./types";
import { constructSearchParams } from "./utils";

interface ReleasesResponse {
  items: Item[];
  nextCursor: string;
}

interface Variables {
  limit?: number;
  cursor?: string;
  sortBy?: SortBy;
  sortDirection?: SortDirection;
  recordTagIn?: string;
}

export async function getReleases({ recordTagIn, ...variables }: Variables = {}) {
  const searchParams = constructSearchParams({
    limit: 10,
    sortBy: "lastPublishedAt",
    recordTagIn: recordTagIn || undefined,
    ...variables,
  });
  const releaseResponse = await fetch(
    `${process.env.API_BASE_URL}/core/rpc/records.listRecordsV2?${searchParams.toString()}`,
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
