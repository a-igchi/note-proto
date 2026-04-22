import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export const queryKeys = {
  graph: ["graph"] as const,
  notes: ["notes"] as const,
  note: (id: string) => ["note", id] as const,
  search: (query: string) => ["search", query] as const,
};
