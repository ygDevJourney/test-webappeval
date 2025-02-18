export interface Gif {
  nextPage: string;
  gifData: GifData[];
}

export interface GifData {
  itemUrl?: string;
  gridUrl?: string;
}

export interface GifOptions {
  searchTerm?: string;
  limit?: number; // number of records
  media_filter?: string; //gif,tinygif,mp4,tinymp4
  contentfilter?: string; // off, low, medium, and high.
  pos?: string; // next page identifier for pagination support
  searchFilter?: string;
  random?: boolean;
  type?: string; // gif or stickers
  requestType: string;
}

// Default values for optional fields
export const defaultGifOptions: Partial<GifOptions> = {
  limit: 30, // default value
  media_filter: "gif", // default value
  contentfilter: "medium", // default value
  searchFilter: "",
  random: false, // default value
  type: "gif", // default value
  pos: "",
};

// Function to merge user options with default values
export function getGifOptions(options: Partial<GifOptions>): GifOptions {
  return { ...defaultGifOptions, ...options } as GifOptions;
}
