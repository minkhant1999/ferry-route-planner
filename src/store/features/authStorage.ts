import type { StoredUser, User } from '@/types/auth';
import { normalizeStoredUser } from '@/types/auth';

const USERS_KEY = 'service-hub-users';
const SESSION_KEY = 'service-hub-session';

export function readStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as (StoredUser & { role: string })[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeStoredUser);
  } catch {
    return [];
  }
}

export function writeStoredUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function readSessionUserId(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function writeSessionUserId(userId: string | null): void {
  if (userId) {
    localStorage.setItem(SESSION_KEY, userId);
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const normalized = email.trim().toLowerCase();
  return readStoredUsers().find((user) => user.email === normalized);
}

export function toPublicUser(user: StoredUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    ownerServiceId: user.ownerServiceId,
  };
}

export function hashPassword(password: string): string {
  return btoa(password);
}

export function verifyPassword(password: string, passwordHash: string): boolean {
  return hashPassword(password) === passwordHash;
}
