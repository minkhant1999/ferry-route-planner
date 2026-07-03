export interface ServiceDefinition {
  id: string;
  name: string;
  shortDescription: string;
  tagline: string;
  gradient: string;
  icon: string;
  path: string;
}

export const SERVICES: ServiceDefinition[] = [
  {
    id: 'house-renting',
    name: 'House Renting',
    shortDescription: 'Find apartments, houses, and rooms for short or long stays.',
    tagline: 'Your next home, one search away',
    gradient: 'from-blue-600 to-indigo-700',
    icon: '🏠',
    path: '/services/house-renting',
  },
  {
    id: 'car-renting',
    name: 'Car Renting',
    shortDescription: 'Rent cars by the hour or day with flexible pickup options.',
    tagline: 'Drive on your schedule',
    gradient: 'from-slate-700 to-slate-900',
    icon: '🚗',
    path: '/services/car-renting',
  },
  {
    id: 'delivery',
    name: 'Delivery Service',
    shortDescription: 'Fast local delivery with optimized routes for drivers.',
    tagline: 'Deliver smarter, not harder',
    gradient: 'from-emerald-600 to-teal-700',
    icon: '📦',
    path: '/services/delivery',
  },
  {
    id: 'laundry',
    name: 'Laundry Service',
    shortDescription: 'Pickup, wash, fold, and return — hassle-free laundry.',
    tagline: 'Fresh clothes, zero effort',
    gradient: 'from-sky-500 to-blue-600',
    icon: '🧺',
    path: '/services/laundry',
  },
  {
    id: 'plumbing',
    name: 'Plumbing Service',
    shortDescription: 'Licensed plumbers for repairs, installs, and emergencies.',
    tagline: 'Fix leaks before they spread',
    gradient: 'from-cyan-600 to-blue-800',
    icon: '🔧',
    path: '/services/plumbing',
  },
  {
    id: 'aircon',
    name: 'Air Con Services',
    shortDescription: 'Installation, cleaning, and repair for all AC units.',
    tagline: 'Stay cool all year round',
    gradient: 'from-violet-600 to-purple-800',
    icon: '❄️',
    path: '/services/aircon',
  },
  {
    id: 'electronics',
    name: 'Electronics Service',
    shortDescription: 'TV, phone, and appliance repair at your doorstep.',
    tagline: 'Tech fixed by trusted pros',
    gradient: 'from-orange-500 to-red-600',
    icon: '⚡',
    path: '/services/electronics',
  },
  {
    id: 'plants-nursery',
    name: 'Plants Nursery',
    shortDescription: 'Indoor plants, garden saplings, pots, and landscaping supplies.',
    tagline: 'Grow green, live better',
    gradient: 'from-green-600 to-lime-700',
    icon: '🌱',
    path: '/services/plants-nursery',
  },
  {
    id: 'home-cleaning',
    name: 'Home Cleaning',
    shortDescription: 'Professional maids and deep-clean teams for homes and offices.',
    tagline: 'Spotless spaces, more free time',
    gradient: 'from-teal-500 to-cyan-700',
    icon: '🧹',
    path: '/services/home-cleaning',
  },
  {
    id: 'car-wash',
    name: 'Car Wash',
    shortDescription: 'Exterior wash, interior vacuum, and detailing at your location.',
    tagline: 'Shine on the go',
    gradient: 'from-blue-500 to-indigo-600',
    icon: '🫧',
    path: '/services/car-wash',
  },
  {
    id: 'dog-spa',
    name: 'Dog Spa',
    shortDescription: 'Grooming, bathing, nail trim, and pampering for your pup.',
    tagline: 'Happy dogs, happy owners',
    gradient: 'from-pink-500 to-rose-600',
    icon: '🐕',
    path: '/services/dog-spa',
  },
];

export const SERVICE_BY_ID = Object.fromEntries(
  SERVICES.map((service) => [service.id, service]),
) as Record<string, ServiceDefinition>;

export const DELIVERY_ROUTE_PLANNER_PATH = '/delivery/route-planner';
