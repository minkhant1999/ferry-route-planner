import { BrowserRouter, useRoutes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { RoutePlansPersistence } from '@/hooks/useRoutePlansPersistence';
import { appRoutes } from '@/routes';
import { store } from '@/store';

function AppRoutes() {
  const element = useRoutes([
    {
      path: '/',
      element: <DashboardLayout />,
      children: appRoutes,
    },
  ]);
  return element;
}

export default function App() {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#2563eb',
            borderRadius: 8,
          },
        }}
      >
        <BrowserRouter>
          <RoutePlansPersistence />
          <AppRoutes />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  );
}
