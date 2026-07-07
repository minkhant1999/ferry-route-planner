import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppButton } from '@/components';
import { ServiceAdGrid, ServiceSearch, useFilteredServices } from '@/features/home';

export function HomePage() {
  const [query, setQuery] = useState('');
  const filteredServices = useFilteredServices(query);

  return (
    <div>
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-14 text-white sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-blue-300">
            Make your way safe and easy
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Everything you need, one platform
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Rent homes and cars, book delivery, cleaning, car wash, dog spa, plants, and more —
            or join as a provider and grow your business.
          </p>
          <div className="mt-8">
            <ServiceSearch onQueryChange={setQuery} />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="no-underline">
              <AppButton type="primary" size="large">
                Get started
              </AppButton>
            </Link>
            
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Our services</h2>
            <p className="mt-1 text-slate-600">
              {query
                ? `Showing results for “${query}”`
                : 'Browse what we offer — advertisements and highlights below.'}
            </p>
          </div>
        </div>
        <ServiceAdGrid services={filteredServices} />
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
          <div className="rounded-xl bg-slate-50 p-6">
            <p className="text-2xl font-bold text-blue-600">11+</p>
            <p className="mt-1 font-medium text-slate-900">Service categories</p>
            <p className="mt-2 text-sm text-slate-600">
              From rentals to on-demand repairs, all in one place.
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-6">
            <p className="text-2xl font-bold text-blue-600">GPS</p>
            <p className="mt-1 font-medium text-slate-900">Smart delivery routes</p>
            <p className="mt-2 text-sm text-slate-600">
              Delivery drivers use our route planner with OSRM optimization.
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-6">
            <p className="text-2xl font-bold text-blue-600">24/7</p>
            <p className="mt-1 font-medium text-slate-900">Book anytime</p>
            <p className="mt-2 text-sm text-slate-600">
              Search, compare, and register in minutes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
