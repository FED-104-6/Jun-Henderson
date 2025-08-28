export type UserType = 'tenant' | 'landlord' | 'other';

export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  displayName?: string;
  dob: string;
  userType: UserType;
  flatsCount: number;
  isAdmin: boolean;
  photoURL?: string | null;
  createdAt: number;
  updatedAt: number;
}
