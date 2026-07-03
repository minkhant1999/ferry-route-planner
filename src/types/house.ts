export type HouseStatus = 'available' | 'rented';

export type RenterIdType = 'nrc' | 'passport';

export interface RenterDetail {
  name: string;
  phone: string;
  idType: RenterIdType;
  idNumber: string;
  contractStart: string;
  durationMonths: number;
  contractEnd: string;
  contractPhoto?: string;
  nrcPhoto?: string;
}

export interface HouseListing {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  photos: string[];
  status: HouseStatus;
  renter?: RenterDetail;
  createdAt: string;
  updatedAt: string;
}

export const HOUSE_STATUS_LABELS: Record<HouseStatus, string> = {
  available: 'Available',
  rented: 'Rented',
};
