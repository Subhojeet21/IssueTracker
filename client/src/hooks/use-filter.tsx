import { useState, useCallback } from 'react';

export interface Filters {
  status?: string[];
  priority?: string[];
  category?: string;
  assignee?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  search?: string;
}

export function useFilter() {
  const [filters, setFilters] = useState<Filters>({});
  const [pendingFilters, setPendingFilters] = useState<Filters>({});
  
  const updateFilter = useCallback((key: keyof Filters, value: any) => {
    setPendingFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);
  
  const applyFilters = useCallback(() => {
    setFilters(pendingFilters);
  }, [pendingFilters]);
  
  const resetFilters = useCallback(() => {
    setFilters({});
    setPendingFilters({});
  }, []);
  
  return {
    filters,
    pendingFilters,
    updateFilter,
    applyFilters,
    resetFilters
  };
}
