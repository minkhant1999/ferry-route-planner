import { BrowserRouter, useRoutes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { AuthPersistence } from '@/hooks/useAuthPersistence';
import { HousesPersistence } from '@/hooks/useHousesPersistence';
import { RoutePlansPersistence } from '@/hooks/useRoutePlansPersistence';
import { appRoutes } from '@/routes';
import { store } from '@/store';

function AppRoutes() {
  return useRoutes(appRoutes);
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
          <AuthPersistence />
          <HousesPersistence />
          <RoutePlansPersistence />
          <AppRoutes />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  );
}
