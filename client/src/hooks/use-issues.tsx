import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Issue } from '@shared/schema';
import { useFilter } from './use-filter';

export function useIssues() {
  const { filters } = useFilter();
  
  const { data: issues = [], isLoading, isError } = useQuery<Issue[]>({
    queryKey: ['/api/issues'],
  });
  
  // Apply filters to the issues
  const filteredIssues = issues.filter(issue => {
    // Status filter
    if (filters.status && filters.status.length > 0 && !filters.status.includes(issue.status)) {
      return false;
    }
    
    // Priority filter
    if (filters.priority && filters.priority.length > 0 && !filters.priority.includes(issue.priority)) {
      return false;
    }
    
    // Category filter
    if (filters.category && issue.category !== filters.category) {
      return false;
    }
    
    // Assignee filter
    if (filters.assignee) {
      if (filters.assignee === 'me' && issue.assigneeId !== 1) { // Assuming current user is John Doe with ID 1
        return false;
      } else if (filters.assignee === 'unassigned' && issue.assigneeId) {
        return false;
      } else if (!isNaN(Number(filters.assignee)) && issue.assigneeId !== Number(filters.assignee)) {
        return false;
      }
    }
    
    // Date range filter
    if (filters.dateRange && (filters.dateRange.from || filters.dateRange.to)) {
      const issueDate = new Date(issue.createdAt as string);
      
      if (filters.dateRange.from) {
        const fromDate = new Date(filters.dateRange.from);
        if (issueDate < fromDate) {
          return false;
        }
      }
      
      if (filters.dateRange.to) {
        const toDate = new Date(filters.dateRange.to);
        toDate.setHours(23, 59, 59, 999); // End of the day
        if (issueDate > toDate) {
          return false;
        }
      }
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        issue.title.toLowerCase().includes(searchLower) ||
        issue.description.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });  
  return {
    issues: filteredIssues,
    allIssues: issues,
    isLoading,
    isError
  };
}

export function useIssueById(id: number) {
  return useQuery<Issue>({
    queryKey: [`/api/issues/${id}`],
    enabled: !!id,
  });
}
