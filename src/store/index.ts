import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '@/store/api/baseApi';
import authReducer from '@/store/features/authSlice';
import housesReducer from '@/store/features/housesSlice';
import routePlansReducer from '@/store/features/routePlansSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    houses: housesReducer,
    routePlans: routePlansReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
