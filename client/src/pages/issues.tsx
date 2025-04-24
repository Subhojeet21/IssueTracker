
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import IssueTable from '@/components/issues/IssueTable';
import IssueForm from '@/components/issues/IssueForm';
import { useIssues } from '@/hooks/use-issues';
import { useFilter } from '@/hooks/use-filter';
import { getStatusOptions, getPriorityOptions, getCategoryOptions } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

const Issues = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { issues, isLoading } = useIssues();
  const { filters, updateFilter } = useFilter();
  const { user, logout } = useAuth();

  if (!user) return null;
  
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
            <i className="fas fa-plus mr-2"></i>
            Create Issue
          </Button>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <Input 
            placeholder="Search issues..." 
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
          
          <Select 
            value={filters.status?.[0] || 'all'} 
            onValueChange={(value) => updateFilter('status', value === 'all' ? [] : [value])}
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

          <Select 
            value={filters.priority?.[0] || 'all'}
            onValueChange={(value) => updateFilter('priority', value === 'all' ? [] : [value])}
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

          <Select 
            value={filters.category || 'all'}
            onValueChange={(value) => updateFilter('category', value === 'all' ? '' : value)}
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

          <Select 
            value={filters.assignee || 'anyone'}
            onValueChange={(value) => updateFilter('assignee', value === 'anyone' ? '' : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Assigned To" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="anyone">Anyone</SelectItem>
              <SelectItem value="me">Me</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
            </SelectContent>
          </Select>
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
