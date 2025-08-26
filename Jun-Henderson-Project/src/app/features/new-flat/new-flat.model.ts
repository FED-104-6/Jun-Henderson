export interface Flat {
    city: string;
    streetName: string;
    streetNumber: number;
    areaSize: number;
    hasAC: boolean;
    yearBuilt: number;
    rentPrice: number;
    dateAvailable: string; // ISO date string "YYYY-MM-DD"
    
    id?: string;
    ownerId?: string;
}
