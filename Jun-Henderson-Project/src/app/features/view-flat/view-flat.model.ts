// Keep this interface name and export as-is.
export interface Flat {
  city: string;
  streetName: string;
  streetNumber: number;
  areaSize: number;
  hasAC: boolean;
  yearBuilt: number;
  rentPrice: number;
  dateAvailable: string; // "YYYY-MM-DD"

  id?: string;
  ownerId?: string;

  image?: string;        // DataURL or URL shown in cards
  favorites?: string[];  // list of user emails who favorited this flat
}
