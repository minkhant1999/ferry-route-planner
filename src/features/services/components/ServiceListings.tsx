import { getListingsForService } from '@/constants/serviceExamples';
import { ServiceListingCard } from '@/features/services/components/ServiceListingCard';

interface ServiceListingsProps {
  serviceId: string;
  serviceName: string;
}

export function ServiceListings({ serviceId, serviceName }: ServiceListingsProps) {
  const listings = getListingsForService(serviceId);

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Available listings</h2>
        <p className="mt-1 text-sm text-slate-600">
          Browse example {serviceName.toLowerCase()} offers — no login needed. Sign in only when
          you book or contact a provider.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ServiceListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
