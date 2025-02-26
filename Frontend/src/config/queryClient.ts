import { QueryClient } from "@tanstack/react-query";

export const queryCLient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
