import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { readStoredHouses, writeStoredHouses } from '@/store/features/housesStorage';
import type { HouseListing, RenterDetail } from '@/types/house';
import { createId } from '@/utils/createId';

interface HousesState {
  houses: HouseListing[];
  isHydrated: boolean;
}

const initialState: HousesState = {
  houses: [],
  isHydrated: false,
};

const housesSlice = createSlice({
  name: 'houses',
  initialState,
  reducers: {
    hydrateHouses(state) {
      state.houses = readStoredHouses();
      state.isHydrated = true;
    },
    addHouse(
      state,
      action: PayloadAction<Omit<HouseListing, 'id' | 'createdAt' | 'updatedAt'>>,
    ) {
      const now = new Date().toISOString();
      state.houses.push({
        ...action.payload,
        id: createId(),
        createdAt: now,
        updatedAt: now,
      });
      writeStoredHouses(state.houses);
    },
    updateHouse(state, action: PayloadAction<HouseListing>) {
      const index = state.houses.findIndex((h) => h.id === action.payload.id);
      if (index === -1) return;
      state.houses[index] = {
        ...action.payload,
        updatedAt: new Date().toISOString(),
      };
      writeStoredHouses(state.houses);
    },
    deleteHouse(state, action: PayloadAction<string>) {
      state.houses = state.houses.filter((h) => h.id !== action.payload);
      writeStoredHouses(state.houses);
    },
  },
});

export const { hydrateHouses, addHouse, updateHouse, deleteHouse } = housesSlice.actions;
export default housesSlice.reducer;

export type { RenterDetail };
