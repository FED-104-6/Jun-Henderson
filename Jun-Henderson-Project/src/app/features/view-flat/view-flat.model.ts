// Minimal Flat model used by View Flat.
// Keep this in sync with the New Flat form.
export interface Flat {
  city: string;
  streetName: string;
  streetNumber: number;
  areaSize: number;
  hasAC: boolean;
  yearBuilt: number;
  rentPrice: number;
  dateAvailable: string; // ISO "YYYY-MM-DD"

  id?: string;   // will be defined when the item is created
  ownerId?: string;
}
