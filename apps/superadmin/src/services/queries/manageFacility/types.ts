export interface Facility {
  id: string;
  numberOfUsers?: number | null;
  facilityTypeId: number;
  facilityName: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: number;
  city: string;
  stateId: number;
  countryId: number;
  isActive: boolean;
  dateCreated: string;
  rebatePercent: number;
  logoPath: string;
}

export interface FacilityUser {
  id: string;
  firstName: string;
  lastName: string;
  role: string; //Change to appropriate roles
  lastLogin: string;
  dateCreated: string;
}
