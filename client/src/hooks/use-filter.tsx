import { useState, useCallback, createContext, useContext, ReactNode } from 'react';

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

interface FilterContextType {
  filters: Filters;
  pendingFilters: Filters;
  updateFilter: (key: keyof Filters, value: any) => void;
  applyFilters: () => void;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
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
  
  return (
    <FilterContext.Provider value={{
      filters,
      pendingFilters,
      updateFilter,
      applyFilters,
      resetFilters
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}
