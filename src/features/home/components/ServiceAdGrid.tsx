import { Link } from 'react-router-dom';
import type { ServiceDefinition } from '@/constants/services';

interface ServiceAdGridProps {
  services: ServiceDefinition[];
}

export function ServiceAdGrid({ services }: ServiceAdGridProps) {
  if (services.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-slate-500">
        No services match your search. Try another keyword.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Link
          key={service.id}
          to={service.path}
          className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm no-underline transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div
            className={`bg-gradient-to-br ${service.gradient} px-5 py-8 text-white transition group-hover:brightness-110`}
          >
            <span className="text-3xl" aria-hidden>
              {service.icon}
            </span>
            <h3 className="mt-3 text-lg font-bold">{service.name}</h3>
            <p className="mt-1 text-sm text-white/90">{service.tagline}</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-sm leading-relaxed text-slate-600">
              {service.shortDescription}
            </p>
            <span className="mt-3 inline-block text-sm font-medium text-blue-600 group-hover:underline">
              Explore →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
