import { API_URL } from './constants';
import type { Contract } from '@/types/contract';
import type { Paginated } from '@/types/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 30 } });
  if (!res.ok) {
    let detail = `API request failed (${res.status})`;
    try {
      const body = (await res.json()) as { message?: string };
      if (body.message) detail = body.message;
    } catch {
      // Preserve the HTTP status when the server returned a non-JSON error.
    }
    throw new ApiError(detail, res.status);
  }
  return (await res.json()) as T;
}

export const api = {
  contract: (id: string) => get<Contract>(`/contracts/${id}`),
  contracts: (q = '') => get<Paginated<Contract>>(`/contracts${q}`),
  search: (q: string) => get<{ results: Contract[] }>(`/search?q=${encodeURIComponent(q)}`),
};
