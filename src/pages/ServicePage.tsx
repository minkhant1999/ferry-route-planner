import { Link, useParams } from 'react-router-dom';
import { Alert } from 'antd';
import { AppButton } from '@/components';
import { SERVICE_BY_ID, DELIVERY_ROUTE_PLANNER_PATH } from '@/constants/services';
import { ServiceListings } from '@/features/services';
import { useAppSelector } from '@/store/hooks';

export function ServicePage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const user = useAppSelector((state) => state.auth.user);
  const service = serviceId ? SERVICE_BY_ID[serviceId] : undefined;

  if (!service) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Alert type="warning" showIcon message="Service not found" />
        <Link to="/" className="mt-4 inline-block text-blue-600">
          ← Back to home
        </Link>
      </div>
    );
  }

  const isDelivery = service.id === 'delivery';
  const canUsePlanner =
    user?.role === 'owner' && user.ownerServiceId === 'delivery';

  return (
    <div>
      <section
        className={`bg-gradient-to-br ${service.gradient} px-4 py-14 text-white sm:px-6 sm:py-16`}
      >
        <div className="mx-auto max-w-7xl">
          <span className="text-4xl" aria-hidden>
            {service.icon}
          </span>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{service.name}</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/90">{service.tagline}</p>
          <p className="mt-2 max-w-2xl text-sm text-white/80">{service.shortDescription}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6">
        <ServiceListings serviceId={service.id} serviceName={service.name} />

        {isDelivery ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
            <p className="text-sm font-semibold text-emerald-900">For delivery drivers</p>
            <p className="mt-1 text-sm text-emerald-800">
              Optimize pickup order and driving paths with OpenStreetMap (OSRM).
            </p>
            {canUsePlanner ? (
              <Link to={DELIVERY_ROUTE_PLANNER_PATH} className="mt-4 inline-block no-underline">
                <AppButton type="primary">Open route planner</AppButton>
              </Link>
            ) : (
              <p className="mt-3 text-sm text-emerald-900">
                <Link to="/register" className="font-medium text-emerald-700 underline">
                  Register
                </Link>{' '}
                or{' '}
                <Link to="/login" className="font-medium text-emerald-700 underline">
                  log in
                </Link>{' '}
                as an <strong>Owner</strong> and select <strong>Delivery Service</strong> to access
                the route planner.
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
