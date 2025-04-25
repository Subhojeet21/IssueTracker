import { useQuery } from '@tanstack/react-query';
import { Issue } from '@shared/schema';

export function useAnalytics() {
  const { data: issues = [], isLoading, isError } = useQuery<Issue[]>({
    queryKey: ['/api/issues'],
    queryFn: async () => {
      const response = await fetch('/api/issues');
      if (!response.ok) {
        throw new Error('Failed to fetch issues');
      }
      return response.json();
    },
  });

  return { issues, isLoading, isError };
}