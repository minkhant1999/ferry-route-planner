import { Outlet } from 'react-router-dom';
import { MainFooter } from '@/components/footer';
import { MainNavbar } from '@/components/navbar';

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <MainNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <MainFooter />
    </div>
  );
}
