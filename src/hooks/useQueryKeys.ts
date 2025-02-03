export const queryKeys = {
  customers: {
    all: ['customers'] as const,
    byId: (id: string) => ['customers', id] as const,
    search: (query: string) => ['customers', 'search', query] as const,
  },
  inventory: {
    all: ['inventory'] as const,
    byId: (id: string) => ['inventory', id] as const,
    categories: ['inventory', 'categories'] as const,
    suppliers: ['inventory', 'suppliers'] as const,
  },
  bookings: {
    all: ['bookings'] as const,
    byDate: (date: string) => ['bookings', 'date', date] as const,
  },
  staff: {
    all: ['staff'] as const,
    byId: (id: string) => ['staff', id] as const,
  }
} as const;

export type QueryKeys = typeof queryKeys;