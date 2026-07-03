import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  findUserByEmail,
  hashPassword,
  readSessionUserId,
  readStoredUsers,
  toPublicUser,
  verifyPassword,
  writeSessionUserId,
  writeStoredUsers,
} from '@/store/features/authStorage';
import type { User, UserRole } from '@/types/auth';
import type { StoredUser } from '@/types/auth';
import { createId } from '@/utils/createId';

interface AuthState {
  user: User | null;
  isHydrated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isHydrated: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrateAuth(state) {
      const userId = readSessionUserId();
      if (!userId) {
        state.isHydrated = true;
        return;
      }
      const stored = readStoredUsers().find((user) => user.id === userId);
      state.user = stored ? toPublicUser(stored) : null;
      if (!stored) {
        writeSessionUserId(null);
      }
      state.isHydrated = true;
    },
    logout(state) {
      state.user = null;
      state.error = null;
      writeSessionUserId(null);
    },
    clearAuthError(state) {
      state.error = null;
    },
    registerSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.error = null;
      writeSessionUserId(action.payload.id);
    },
    loginSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.error = null;
      writeSessionUserId(action.payload.id);
    },
    authFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const {
  hydrateAuth,
  logout,
  clearAuthError,
  registerSuccess,
  loginSuccess,
  authFailed,
} = authSlice.actions;

export default authSlice.reducer;

export function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  ownerServiceId?: string;
}) {
  return (dispatch: (action: ReturnType<typeof registerSuccess | typeof authFailed>) => void) => {
    const email = payload.email.trim().toLowerCase();
    const users = readStoredUsers();

    if (users.some((user) => user.email === email)) {
      dispatch(authFailed('An account with this email already exists.'));
      return;
    }

    const newUser: StoredUser = {
      id: createId(),
      name: payload.name.trim(),
      email,
      role: payload.role,
      ownerServiceId:
        payload.role === 'owner' ? payload.ownerServiceId : undefined,
      passwordHash: hashPassword(payload.password),
    };

    writeStoredUsers([...users, newUser]);
    dispatch(registerSuccess(toPublicUser(newUser)));
  };
}

export function loginUser(payload: { email: string; password: string }) {
  return (dispatch: (action: ReturnType<typeof loginSuccess | typeof authFailed>) => void) => {
    const stored = findUserByEmail(payload.email);
    if (!stored || !verifyPassword(payload.password, stored.passwordHash)) {
      dispatch(authFailed('Invalid email or password.'));
      return;
    }
    dispatch(loginSuccess(toPublicUser(stored)));
  };
}
