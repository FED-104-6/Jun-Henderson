export interface Flat {
  city: string;
  streetName: string;
  streetNumber: number;
  areaSize: number;
  hasAC: boolean;
  yearBuilt: number;
  rentPrice: number;
  dateAvailable: string; // ISO date "YYYY-MM-DD"

  id?: string;          // generated on save
  ownerId?: string;     // logged-in user uid

  image?: string;       // dataURL or URL
  favorites?: string[]; // list of user emails who favourited this flat
}
