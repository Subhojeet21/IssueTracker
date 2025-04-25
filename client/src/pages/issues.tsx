
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import IssueTable from '@/components/issues/IssueTable';
import IssueForm from '@/components/issues/IssueForm';
import { useIssues } from '@/hooks/use-issues';
import { useFilter } from '@/hooks/use-filter';
import { getStatusOptions, getPriorityOptions, getCategoryOptions, getTeamOptions, getEnvironmentOptions } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { Label } from "@/components/ui/label";
import { PlusCircle } from 'lucide-react';

const Issues = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { issues, isLoading } = useIssues();
  const { filters, updateFilter, applyFilters } = useFilter();
  const { user, logout } = useAuth();

  const handleResetFilters = () => {
      updateFilter('search', '');
      updateFilter('status', []);
      updateFilter('priority', []);
      updateFilter('category', '');
      updateFilter('assignee', '');
      updateFilter('team', ''); 
      applyFilters();
  };

  useEffect(() => {
    applyFilters();
  }, [filters, applyFilters]);

  if (!user) return null;

  const hasActiveFilters = filters.search || filters.status || filters.priority || filters.category || filters.assignee || filters.team;
  
  return (
    <div>
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Issues</h1>
            <p className="text-sm text-gray-500">View and manage all issues</p>
          </div>
          <Button
            className="bg-primary hover:bg-primary-dark"
            onClick={() => setIsFormOpen(true)}
          >
            {/*<i className="fas fa-plus mr-2"></i>*/}
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Issue
          </Button>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <Input 
            placeholder="Search issues..." 
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
          />

          {hasActiveFilters && (
            <div className="flex justify-end">          
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}            
                className="text-gray-600 hover:text-gray-900 border-red-700"
              >
                {/*<X className="mr-2 h-4 w-4" />*/}
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                Clear filters
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status-filter">Status</Label>
            <Select 
              value={filters.status?.[0] || 'all'} 
              onValueChange={(value) => {
                updateFilter('status', value === 'all' ? [] : [value]);
              }
            }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {getStatusOptions().map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status-filter">Priority</Label>
            <Select 
              value={filters.priority?.[0] || 'all'}
              onValueChange={(value) => {
                updateFilter('priority', value === 'all' ? [] : [value]);
              }
            }
            >
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {getPriorityOptions().map(priority => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status-filter">Category</Label>
            <Select 
              value={filters.category || 'all'}
              onValueChange={(value) => {
                updateFilter('category', value === 'all' ? '' : value);
              }
            }
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {getCategoryOptions().map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status-filter">Assigned To</Label>
            <Select 
              value={filters.assignee || 'all'}
              onValueChange={(value) => {
                updateFilter('assignee', value === 'all' ? '' : value);
              }
            }
            >
              <SelectTrigger>
                <SelectValue placeholder="Assigned To" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Anyone</SelectItem>
                <SelectItem value="me">Me</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
          <Label htmlFor="status-filter">Team Name</Label>
            <Select 
              value={filters.team || 'all'}
              onValueChange={(value) => {
                updateFilter('team', value === 'all' ? '' : value);
              }
            }
            >
              <SelectTrigger>
                <SelectValue placeholder="Team Name" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
                {getTeamOptions().map(team => (
                  <SelectItem key={team.value} value={team.value}>
                    {team.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
          <Label htmlFor="status-filter">Environment</Label>
            <Select 
              value={filters.environment || 'all'}
              onValueChange={(value) => {
                updateFilter('environment', value === 'all' ? '' : value);
              }
            }
            >
              <SelectTrigger>
                <SelectValue placeholder="Environment Name" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="all">All Envs</SelectItem>
                {getEnvironmentOptions().map(environment => (
                  <SelectItem key={environment.value} value={environment.value}>
                    {environment.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <IssueTable issues={issues} isLoading={isLoading} />
        </CardContent>
      </Card>
      
      <IssueForm open={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
};
export default Issues;
