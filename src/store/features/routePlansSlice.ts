import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { STORAGE_KEY } from '@/constants/routeTypes';
import type {
  GeoStop,
  OptimizedLeg,
  RoutePlan,
  RoutePlansState,
  Student,
} from '@/types/geo';

const createId = () => crypto.randomUUID();

const defaultDepot: GeoStop = {
  id: createId(),
  name: 'Bus depot',
  lat: 25.2048,
  lng: 55.2708,
};

const defaultSchool: GeoStop = {
  id: createId(),
  name: 'School',
  lat: 25.1972,
  lng: 55.2744,
};

function normalizeStudent(student: Student): Student {
  return {
    ...student,
    phone: student.phone ?? '',
  };
}

function normalizePlan(plan: RoutePlan): RoutePlan {
  return {
    ...plan,
    students: plan.students.map(normalizeStudent),
  };
}

export const loadRoutePlans = createAsyncThunk('routePlans/load', async () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [] as RoutePlan[];
  }
  const plans = JSON.parse(raw) as RoutePlan[];
  return plans.map(normalizePlan);
});

export const persistRoutePlans = createAsyncThunk(
  'routePlans/persist',
  async (plans: RoutePlan[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    return plans;
  },
);

const initialState: RoutePlansState = {
  plans: [],
  selectedPlanId: null,
};

const routePlansSlice = createSlice({
  name: 'routePlans',
  initialState,
  reducers: {
    selectPlan(state, action: PayloadAction<string | null>) {
      state.selectedPlanId = action.payload;
    },
    addPlan(
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        description?: string;
        grade?: string;
        schedule: RoutePlan['schedule'];
        depot?: Partial<GeoStop>;
        school?: Partial<GeoStop>;
        students?: Array<Omit<Student, 'id'> & { id?: string }>;
      }>,
    ) {
      const now = new Date().toISOString();
      const plan: RoutePlan = {
        id: action.payload.id,
        name: action.payload.name,
        description: action.payload.description,
        grade: action.payload.grade,
        schedule: action.payload.schedule,
        depot: {
          ...defaultDepot,
          id: createId(),
          name: action.payload.depot?.name ?? defaultDepot.name,
          lat: action.payload.depot?.lat ?? defaultDepot.lat,
          lng: action.payload.depot?.lng ?? defaultDepot.lng,
        },
        school: {
          ...defaultSchool,
          id: createId(),
          name: action.payload.school?.name ?? defaultSchool.name,
          lat: action.payload.school?.lat ?? defaultSchool.lat,
          lng: action.payload.school?.lng ?? defaultSchool.lng,
        },
        students: (action.payload.students ?? []).map((s) => ({
          id: s.id ?? createId(),
          name: s.name,
          phone: s.phone ?? '',
          lat: s.lat,
          lng: s.lng,
        })),
        morning: null,
        evening: null,
        createdAt: now,
        updatedAt: now,
      };
      state.plans.unshift(plan);
      state.selectedPlanId = plan.id;
    },
    updatePlanMeta(
      state,
      action: PayloadAction<{
        id: string;
        name?: string;
        description?: string;
        grade?: string;
        schedule?: RoutePlan['schedule'];
      }>,
    ) {
      const plan = state.plans.find((p) => p.id === action.payload.id);
      if (!plan) return;
      if (action.payload.name !== undefined) plan.name = action.payload.name;
      if (action.payload.description !== undefined) {
        plan.description = action.payload.description;
      }
      if (action.payload.grade !== undefined) plan.grade = action.payload.grade;
      if (action.payload.schedule !== undefined) plan.schedule = action.payload.schedule;
      plan.updatedAt = new Date().toISOString();
    },
    updateDepot(state, action: PayloadAction<{ planId: string; depot: GeoStop }>) {
      const plan = state.plans.find((p) => p.id === action.payload.planId);
      if (!plan) return;
      plan.depot = action.payload.depot;
      plan.morning = null;
      plan.evening = null;
      plan.updatedAt = new Date().toISOString();
    },
    updateSchool(state, action: PayloadAction<{ planId: string; school: GeoStop }>) {
      const plan = state.plans.find((p) => p.id === action.payload.planId);
      if (!plan) return;
      plan.school = action.payload.school;
      plan.morning = null;
      plan.evening = null;
      plan.updatedAt = new Date().toISOString();
    },
    addStudent(state, action: PayloadAction<{ planId: string; student: Student }>) {
      const plan = state.plans.find((p) => p.id === action.payload.planId);
      if (!plan) return;
      plan.students.push(action.payload.student);
      plan.morning = null;
      plan.evening = null;
      plan.updatedAt = new Date().toISOString();
    },
    removeStudent(state, action: PayloadAction<{ planId: string; studentId: string }>) {
      const plan = state.plans.find((p) => p.id === action.payload.planId);
      if (!plan) return;
      plan.students = plan.students.filter((s) => s.id !== action.payload.studentId);
      plan.morning = null;
      plan.evening = null;
      plan.updatedAt = new Date().toISOString();
    },
    setStudents(
      state,
      action: PayloadAction<{ planId: string; students: Student[] }>,
    ) {
      const plan = state.plans.find((p) => p.id === action.payload.planId);
      if (!plan) return;
      plan.students = action.payload.students;
      plan.morning = null;
      plan.evening = null;
      plan.updatedAt = new Date().toISOString();
    },
    setOptimizedLeg(
      state,
      action: PayloadAction<{ planId: string; leg: OptimizedLeg }>,
    ) {
      const plan = state.plans.find((p) => p.id === action.payload.planId);
      if (!plan) return;
      if (action.payload.leg.direction === 'morning') {
        plan.morning = action.payload.leg;
      } else {
        plan.evening = action.payload.leg;
      }
      plan.updatedAt = new Date().toISOString();
    },
    deletePlan(state, action: PayloadAction<string>) {
      state.plans = state.plans.filter((p) => p.id !== action.payload);
      if (state.selectedPlanId === action.payload) {
        state.selectedPlanId = state.plans[0]?.id ?? null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadRoutePlans.fulfilled, (state, action) => {
        state.plans = action.payload;
        state.selectedPlanId = action.payload[0]?.id ?? null;
      })
      .addCase(persistRoutePlans.fulfilled, (state, action) => {
        state.plans = action.payload;
      });
  },
});

export const {
  selectPlan,
  addPlan,
  updatePlanMeta,
  updateDepot,
  updateSchool,
  addStudent,
  removeStudent,
  setStudents,
  setOptimizedLeg,
  deletePlan,
} = routePlansSlice.actions;

export default routePlansSlice.reducer;
