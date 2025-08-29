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
  dateAvailable: string; // ISO "YYYY-MM-DD"

  image?: string | null;     // image path or URL
  favorites?: string[];      // emails/ids who favorited (optional)
}
