import { Outlet } from 'react-router-dom';
import { CmsSidebar } from '@/features/cms';

export function CmsLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      <CmsSidebar />
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
