import { Outlet, Link } from 'react-router-dom';
import { Layout } from 'antd';

const { Header, Content, Footer } = Layout;

export function DashboardLayout() {
  return (
    <Layout className="min-h-screen bg-slate-50">
      <Header className="!h-auto !leading-normal flex flex-col items-stretch gap-2 bg-slate-900 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-6 md:!h-16 md:py-0">
        <Link
          to="/"
          className="text-base font-semibold text-white no-underline sm:text-lg"
        >
          BusRoute Planner
        </Link>
        <span className="text-xs leading-snug text-slate-300 sm:text-sm">
          School ferry routes · morning &amp; evening
        </span>
      </Header>
      <Content className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
        <Outlet />
      </Content>
      <Footer className="px-4 py-4 text-center text-[11px] leading-relaxed text-slate-500 sm:text-xs">
        Routing via OSRM · Map © OpenStreetMap contributors
      </Footer>
    </Layout>
  );
}
