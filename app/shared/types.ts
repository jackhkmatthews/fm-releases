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

export interface Item {
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

export type SortDirection = "asc" | "desc";

export type SortBy = "firstPublishedAt" | "lastPublishedAt" | "createdAt";
