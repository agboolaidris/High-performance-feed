import { QueryClient } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry once if it fails
      staleTime: Infinity, // Mark data fresh for 30 minutes
      refetchInterval: Infinity, // Fetch every 1r minutes in background
      refetchOnReconnect: true, // Fetch when online
      refetchOnMount: true, // Don't refetch when component mounts
      refetchOnWindowFocus: true, // Don't fetch on app focus
      networkMode: "offlineFirst",
    },
    mutations: {
      networkMode: "offlineFirst",
      retry: 1,
    },
  },
});

export const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 3000, // Save to storage every 3 second
  key: "REACT_QUERY_CACHE",
});
