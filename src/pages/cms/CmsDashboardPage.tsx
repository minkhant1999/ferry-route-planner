import { Link, Navigate } from 'react-router-dom';
import { Card, Statistic } from 'antd';
import { AppButton } from '@/components';
import { SERVICE_BY_ID } from '@/constants/services';
import { useAppSelector } from '@/store/hooks';

export function CmsDashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const serviceId = user?.ownerServiceId;
  const service = serviceId ? SERVICE_BY_ID[serviceId] : undefined;
  const houses = useAppSelector((state) =>
    state.houses.houses.filter((h) => h.ownerId === user?.id),
  );

  if (serviceId === 'house-renting') {
    const available = houses.filter((h) => h.status === 'available').length;
    const rented = houses.filter((h) => h.status === 'rented').length;

    return (
      <div className="app-page">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-600">
          Manage your {service?.name.toLowerCase()} listings and renters.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="app-card shadow-sm">
            <Statistic title="Total houses" value={houses.length} />
          </Card>
          <Card className="app-card shadow-sm">
            <Statistic title="Available" value={available} />
          </Card>
          <Card className="app-card shadow-sm">
            <Statistic title="Rented" value={rented} />
          </Card>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/cms/houses" className="no-underline">
            <AppButton type="primary">View all houses</AppButton>
          </Link>
          <Link to="/cms/houses/new" className="no-underline">
            <AppButton>Add house</AppButton>
          </Link>
        </div>
      </div>
    );
  }

  if (serviceId === 'delivery') {
    return <Navigate to="/delivery/route-planner" replace />;
  }

  return (
    <div className="app-page">
      <h1 className="text-2xl font-bold text-slate-900">Owner dashboard</h1>
      <p className="text-sm text-slate-600">
        CMS for <strong>{service?.name ?? 'your service'}</strong> is coming soon. You can
        manage public listings from here once modules are added.
      </p>
      <Card className="app-card shadow-sm">
        <p className="text-sm text-slate-600">
          Signed in as owner · {service?.icon} {service?.name}
        </p>
      </Card>
    </div>
  );
}
