'use client';
import useSWR from 'swr';
import { get } from '@/lib/api';

export function useContractEvents(id: string) {
  return useSWR(
    id ? ['events', id] : null,
    () => get(`/contracts/${id}/events`),
    { refreshInterval: 15000 },
  );
}
