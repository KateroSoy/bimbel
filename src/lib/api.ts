// Thin client for the Laravel API. The bearer token lives in the auth store (localStorage).

const BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '/api';
const STORAGE_KEY = 'LearnSpace+-storage';

export class ApiError extends Error {
  constructor(message: string, public status: number, public errors: Record<string, string[]> = {}) {
    super(message);
  }

  /** First validation message, or the general message. */
  get first(): string {
    return Object.values(this.errors)[0]?.[0] ?? this.message;
  }
}

export const getToken = (): string | null => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')?.state?.token ?? null;
  } catch {
    return null;
  }
};

let onUnauthorized: () => void = () => {};
/** Called when the server rejects the token, so the app can drop the session. */
export const setUnauthorizedHandler = (fn: () => void) => { onUnauthorized = fn; };

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = getToken();
  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Tidak dapat terhubung ke server. Periksa koneksi Anda.', 0);
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && token) onUnauthorized();
    throw new ApiError(payload?.message ?? `Permintaan gagal (${response.status})`, response.status, payload?.errors ?? {});
  }
  return payload as T;
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body ?? {}),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body ?? {}),
  del: <T>(path: string, body?: unknown) => request<T>('DELETE', path, body),
};
