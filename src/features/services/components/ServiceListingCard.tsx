import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Tag, message } from 'antd';
import { AppButton } from '@/components';
import type { ServiceListing } from '@/types/serviceListing';
import { useAppSelector } from '@/store/hooks';

interface ServiceListingCardProps {
  listing: ServiceListing;
}

function StarRating({ value }: { value: number }) {
  return (
    <span className="text-sm text-amber-600" aria-label={`Rating ${value} out of 5`}>
      ★ {value.toFixed(1)}
    </span>
  );
}

export function ServiceListingCard({ listing }: ServiceListingCardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);

  const handleAction = () => {
    if (!user) {
      navigate('/login', {
        state: {
          from: location.pathname,
          intent: listing.actionType,
          listingTitle: listing.title,
        },
      });
      return;
    }

    if (listing.actionType === 'call') {
      window.location.href = 'tel:+959000000001';
      return;
    }

    message.success(
      listing.actionType === 'book'
        ? `Booking request sent for “${listing.title}”. The provider will contact you soon.`
        : `Request sent for “${listing.title}”. We will confirm shortly.`,
    );
  };

  return (
    <Card className="app-card h-full shadow-sm" styles={{ body: { height: '100%' } }}>
      <div className="flex h-full flex-col">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-slate-900">{listing.title}</h3>
          <StarRating value={listing.rating} />
        </div>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
          {listing.description}
        </p>

        {listing.location ? (
          <p className="mt-2 text-xs text-slate-500">📍 {listing.location}</p>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {listing.tags.map((tag) => (
            <Tag key={tag} className="!m-0">
              {tag}
            </Tag>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">{listing.priceLabel}</p>
            <p className="text-xs text-slate-500">{listing.providerName}</p>
          </div>
          <AppButton type="primary" onClick={handleAction} className="w-full sm:w-auto">
            {listing.actionLabel}
          </AppButton>
        </div>

        {!user ? (
          <p className="mt-2 text-xs text-slate-400">
            {listing.actionType === 'book'
              ? 'Log in required to book'
              : listing.actionType === 'call'
                ? 'Log in required to call provider'
                : 'Log in required to request'}
          </p>
        ) : null}
      </div>
    </Card>
  );
}
