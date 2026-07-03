import { Link, useLocation } from 'react-router-dom';
import { getCmsNavForService, getCmsTitleForService } from '@/constants/cmsNav';
import { SERVICE_BY_ID } from '@/constants/services';
import { useAppSelector } from '@/store/hooks';

export function CmsSidebar() {
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);
  const serviceId = user?.ownerServiceId;
  const navItems = getCmsNavForService(serviceId);
  const service = serviceId ? SERVICE_BY_ID[serviceId] : undefined;

  return (
    <aside className="w-full shrink-0 border-b border-slate-200 bg-white lg:w-56 lg:border-b-0 lg:border-r">
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">CMS</p>
        <p className="mt-1 text-sm font-semibold text-slate-900">
          {getCmsTitleForService(serviceId)}
        </p>
        {service ? (
          <p className="mt-0.5 text-xs text-slate-500">
            {service.icon} {service.name}
          </p>
        ) : null}
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-3 lg:flex-col lg:px-3 lg:pb-6">
        {navItems.map((item) => {
          const active =
            item.path === '/cms'
              ? location.pathname === '/cms'
              : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.key}
              to={item.path}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium no-underline transition ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        <Link
          to="/"
          className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-slate-500 no-underline hover:bg-slate-100 lg:mt-4"
        >
          ← Public site
        </Link>
      </nav>
    </aside>
  );
}
