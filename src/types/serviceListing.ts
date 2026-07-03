export type ListingActionType = 'book' | 'call' | 'request';

export interface ServiceListing {
  id: string;
  serviceId: string;
  title: string;
  description: string;
  priceLabel: string;
  location?: string;
  tags: string[];
  rating: number;
  providerName: string;
  actionType: ListingActionType;
  actionLabel: string;
}
