export interface Flat {
  city: string;
  streetName: string;
  streetNumber: number;
  areaSize: number;
  hasAC: boolean;
  yearBuilt: number;
  rentPrice: number;
  dateAvailable: string;

  id?: string;
  ownerId?: string;
  createdAt?: number;
  updatedAt?: number;

  image?: string;
  favorites?: string[];
}
