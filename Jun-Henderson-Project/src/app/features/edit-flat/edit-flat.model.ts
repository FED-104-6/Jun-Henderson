export interface Flat {
  city: string;
  streetName: string;
  streetNumber: number;
  areaSize: number;        // m²
  hasAC: boolean;
  yearBuilt: number;
  rentPrice: number;       // CAD
  dateAvailable: string;   // ISO "YYYY-MM-DD"

  id?: string;             // defined when created
  ownerId?: string;        // reserved for future auth
}
