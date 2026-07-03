import { useMemo, useState } from 'react';
import { SERVICES } from '@/constants/services';

interface ServiceSearchProps {
  onQueryChange?: (query: string) => void;
}

export function ServiceSearch({ onQueryChange }: ServiceSearchProps) {
  const [query, setQuery] = useState('');

  const handleChange = (value: string) => {
    setQuery(value);
    onQueryChange?.(value);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg focus-within:ring-2 focus-within:ring-blue-500/30">
      <input
        type="search"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search house rental, car wash, dog spa, plants nursery…"
        className="min-h-12 flex-1 border-0 bg-transparent px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        aria-label="Search services"
      />
      <button
        type="button"
        onClick={() => handleChange(query)}
        className="bg-blue-600 px-5 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
}

export function useFilteredServices(query: string) {
  return useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return SERVICES;
    return SERVICES.filter(
      (service) =>
        service.name.toLowerCase().includes(normalized) ||
        service.shortDescription.toLowerCase().includes(normalized) ||
        service.tagline.toLowerCase().includes(normalized),
    );
  }, [query]);
}
