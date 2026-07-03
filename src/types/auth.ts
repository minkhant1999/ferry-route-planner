export type UserRole = 'customer' | 'owner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  /** Set when role is `owner` — which service this owner manages. */
  ownerServiceId?: string;
}

export interface StoredUser extends User {
  passwordHash: string;
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  customer: 'Customer',
  owner: 'Owner (service provider)',
};

export const REGISTER_ROLE_OPTIONS = Object.entries(USER_ROLE_LABELS).map(
  ([value, label]) => ({ value, label }),
);

/** Maps legacy multi-role accounts to owner + service (migration). */
const LEGACY_ROLE_TO_SERVICE: Record<string, string> = {
  delivery: 'delivery',
  house_renting: 'house-renting',
  car_renting: 'car-renting',
  laundry: 'laundry',
  plumbing: 'plumbing',
  aircon: 'aircon',
  electronics: 'electronics',
  plants_nursery: 'plants-nursery',
  home_cleaning: 'home-cleaning',
  car_wash: 'car-wash',
  dog_spa: 'dog-spa',
};

export function normalizeStoredUser(raw: StoredUser & { role: string }): StoredUser {
  if (raw.role === 'customer' || raw.role === 'owner') {
    return raw as StoredUser;
  }

  const serviceId = LEGACY_ROLE_TO_SERVICE[raw.role];
  if (serviceId) {
    return {
      ...raw,
      role: 'owner',
      ownerServiceId: raw.ownerServiceId ?? serviceId,
    };
  }

  return { ...raw, role: 'customer', ownerServiceId: undefined };
}
