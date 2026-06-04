import { createId } from '@/utils/createId';

/**
 * react-hook-form and other libs call `crypto.randomUUID()` on load.
 * It is missing or not a function on HTTP (non-secure origins).
 */
if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID !== 'function') {
  globalThis.crypto.randomUUID = (() =>
    createId()) as typeof globalThis.crypto.randomUUID;
}
