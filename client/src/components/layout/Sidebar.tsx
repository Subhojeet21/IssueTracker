import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFilter } from '@/hooks/use-filter';
import { getStatusOptions, getPriorityOptions, getCategoryOptions } from '@/lib/utils';

interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ open, toggleSidebar }: SidebarProps) => {
  const { filters, updateFilter, resetFilters, applyFilters } = useFilter();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleStatusChange = (status: string, checked: boolean) => {
    const currentStatuses = filters.status || [];
    
    if (status === 'all') {
      updateFilter('status', checked ? [] : getStatusOptions().map(s => s.value));
    } else {
      if (checked) {
        // Add to filter
        updateFilter('status', [...currentStatuses.filter(s => s !== status), status]);
      } else {
        // Remove from filter
        updateFilter('status', currentStatuses.filter(s => s !== status));
      }
    }
  };

  const handlePriorityChange = (priority: string, checked: boolean) => {
    const currentPriorities = filters.priority || [];
    
    if (priority === 'all') {
      updateFilter('priority', checked ? [] : getPriorityOptions().map(p => p.value));
    } else {
      if (checked) {
        updateFilter('priority', [...currentPriorities.filter(p => p !== priority), priority]);
      } else {
        updateFilter('priority', currentPriorities.filter(p => p !== priority));
      }
    }
  };

  const handleCategoryChange = (category: string) => {
    updateFilter('category', category === 'all' ? '' : category);
  };

  const handleAssigneeChange = (assignee: string) => {
    updateFilter('assignee', assignee === 'anyone' ? '' : assignee);
  };

  const handleDateRangeChange = () => {
    updateFilter('dateRange', { from: startDate, to: endDate });
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    resetFilters();
  };

  return (
    <aside 
      className={`w-64 bg-white shadow-md z-20 transition-all ${open ? 'block' : 'hidden'} md:block`}
    >
      <div className="p-4 border-b">
        <div className="relative">
          <Input 
            type="text" 
            placeholder="Search issues..." 
            className="pl-8 pr-4"
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
          <i className="fas fa-search text-gray-400 absolute left-3 top-3"></i>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">FILTERS</h3>
        
        {/* Status Filter */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
          <div className="space-y-1">
            <div className="flex items-center">
              <Checkbox 
                id="status-all" 
                checked={!filters.status || filters.status.length === 0}
                onCheckedChange={(checked) => handleStatusChange('all', !!checked)}
              />
              <Label htmlFor="status-all" className="ml-2 text-sm text-gray-700">All</Label>
            </div>
            
            {getStatusOptions().map((status) => (
              <div key={status.value} className="flex items-center">
                <Checkbox 
                  id={`status-${status.value}`} 
                  checked={filters.status?.includes(status.value)}
                  onCheckedChange={(checked) => handleStatusChange(status.value, !!checked)}
                />
                <Label htmlFor={`status-${status.value}`} className="ml-2 text-sm text-gray-700">
                  {status.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Priority Filter */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Priority</h4>
          <div className="space-y-1">
            <div className="flex items-center">
              <Checkbox 
                id="priority-all" 
                checked={!filters.priority || filters.priority.length === 0}
                onCheckedChange={(checked) => handlePriorityChange('all', !!checked)}
              />
              <Label htmlFor="priority-all" className="ml-2 text-sm text-gray-700">All</Label>
            </div>
            
            {getPriorityOptions().map((priority) => (
              <div key={priority.value} className="flex items-center">
                <Checkbox 
                  id={`priority-${priority.value}`} 
                  checked={filters.priority?.includes(priority.value)}
                  onCheckedChange={(checked) => handlePriorityChange(priority.value, !!checked)}
                />
                <Label htmlFor={`priority-${priority.value}`} className="ml-2 text-sm text-gray-700">
                  {priority.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Category Filter */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
          <Select 
            value={filters.category || 'all'} 
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {getCategoryOptions().map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Assigned To Filter */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned To</h4>
          <Select 
            value={filters.assignee || 'anyone'} 
            onValueChange={handleAssigneeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Anyone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="anyone">Anyone</SelectItem>
              <SelectItem value="me">Me</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              <SelectItem value="2">Alex Taylor</SelectItem>
              <SelectItem value="3">Jordan Smith</SelectItem>
              <SelectItem value="4">Casey Jones</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Date Range Filter */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Date Range</h4>
          <div className="space-y-2">
            <Input 
              type="date" 
              placeholder="From" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input 
              type="date" 
              placeholder="To" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button 
            className="bg-primary hover:bg-primary-dark"
            onClick={applyFilters}
          >
            Apply Filters
          </Button>
          <Button 
            variant="outline"
            className="text-gray-600 hover:text-gray-900"
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
