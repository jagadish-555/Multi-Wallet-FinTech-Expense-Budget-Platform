import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.statusCode === 401 || error?.response?.status === 401) return false;
        return failureCount < 1;
      },
      staleTime: 30_000,
    },
  },
})
