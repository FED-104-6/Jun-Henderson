// Keep this interface name and export as-is.
export interface Flat {
  id?: string;
  ownerId?: string;

  city: string;
  streetName: string;
  streetNumber: number;
  areaSize: number;
  hasAC: boolean;
  yearBuilt: number;
  rentPrice: number;
  dateAvailable: string; // "YYYY-MM-DD"

  // Optional visual & UX fields
  image?: string | null;   // DataURL/URL or app asset path; may be null in legacy data
  favorites?: string[];    // user emails/ids who favorited this flat
}
