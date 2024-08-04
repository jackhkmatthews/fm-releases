interface Content {
  name: string;
  description: string;
  coverImage: CoverImage;
}

interface CoverImage {
  key: string;
  uri: string;
  type: string;
  attributions: [];
}

interface Listing {
  id: string;
  isActive: boolean;
  editionKey: string;
  isPayWhatYouWant: boolean;
  unitPriceAmount: number;
  shippingConfig: ShippingConfig;
  currentSupply: number;
  pendingReservations: number;
  maxSupply: number;
}

interface ShippingConfig {
  flatRateAmount: number;
  allowedCountries: string[];
}

interface Publisher {
  identity: Identity;
  createdAt: string;
}

interface Identity {
  did: string;
  handle: string;
  type: string;
  name: string;
  avatarUri: string;
  createdAt: string;
}

interface Contributor {
  identity: Identity;
  createdAt: string;
}

interface Tag {
  tag: string;
}

interface ReleasedBy {
  slug: string;
  releaseId: string;
  identity: Identity;
  tags: Tag[];
  createdAt: string;
}

interface Item {
  id: string;
  content: Content;
  listing: Listing;
  publisher: Publisher;
  contributors: Contributor[];
  releasedBy: ReleasedBy[];
  recordTags: string[];
  firstPublishedAt: string;
  lastPublishedAt: string;
  isUnlisted: boolean;
  createdAt: string;
}

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
