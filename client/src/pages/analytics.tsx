import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Issue } from '@shared/schema';
import { useFilter } from '@/hooks/use-filter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusChart, CategoryChart } from '@/components/dashboard/Charts';
import { PriorityChart, TrendChart, ResolutionTimeChart, SprintIssuesChart } from '@/components/analytics/AnalyticsCharts';
import { Download } from 'lucide-react';
import { useAnalytics } from '@/hooks/use-analytics';
import { useToast } from '@/hooks/use-toast';
import { MultiSelect } from '@/components/ui/select';

interface AnalyticsData {
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  byCategory: Record<string, number>;
  totalIssues: number;
  openIssues: number;
  resolvedIssues: number;
  avgResolutionTime: number;
}

const Analytics = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSprints, setSelectedSprints] = useState<string[]>([]);
  
  const { filters } = useFilter();
  const { issues, isLoading: isLoadingIssues, isError: isErrorIssues } = useAnalytics();
  const { data, isLoading, isError } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics/summary', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status?.length) params.append('status', filters.status.join(','));
      if (filters.priority?.length) params.append('priority', filters.priority.join(','));
      if (filters.category) params.append('category', filters.category);
      if (filters.assignee) params.append('assignee', filters.assignee);
      if (filters.dateRange?.from) params.append('from', filters.dateRange.from);
      if (filters.dateRange?.to) params.append('to', filters.dateRange.to);
      if (timeRange) params.append('timeRange', timeRange);
      
      const response = await fetch(`/api/analytics/summary?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    }
  });
  
  // Extract unique sprints from issues
  const sprintOptions = useMemo(() => {
    if (!issues) return [];
    const sprints = Array.from(new Set(issues.map(issue => issue.sprint)));
    return sprints.sort();
  }, [issues]);

  // Filter issues by selected sprints
  const filteredIssues = useMemo(() => {
    if (!selectedSprints.length) return issues;
    return issues.filter(issue => selectedSprints.includes(issue.sprint));
  }, [issues, selectedSprints]);

  // Compute summary data from filtered issues
  const filteredSummary = useMemo(() => {
    const byStatus: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    let totalIssues = 0;
    let openIssues = 0;
    let resolvedIssues = 0;
    let totalResolutionTime = 0;
    let resolvedCount = 0;
    filteredIssues.forEach(issue => {
      totalIssues++;
      byStatus[issue.status] = (byStatus[issue.status] || 0) + 1;
      byPriority[issue.priority] = (byPriority[issue.priority] || 0) + 1;
      byCategory[issue.category] = (byCategory[issue.category] || 0) + 1;
      if (issue.status === 'open') openIssues++;
      if (issue.status === 'resolved' || issue.status === 'closed') {
        resolvedIssues++;
        if (issue.createdAt && issue.updatedAt) {
          const created = new Date(issue.createdAt).getTime();
          const resolved = new Date(issue.updatedAt).getTime();
          totalResolutionTime += (resolved - created) / (1000 * 60 * 60 * 24); // days
          resolvedCount++;
        }
      }
    });
    return {
      byStatus,
      byPriority,
      byCategory,
      totalIssues,
      openIssues,
      resolvedIssues,
      avgResolutionTime: resolvedCount ? (totalResolutionTime / resolvedCount).toFixed(1) : 0,
    };
  }, [filteredIssues]);
  
  const handleExportCSV = () => {
    if (!data) return;
    
    // Create CSV content
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // Headers
    csvContent += 'Category,Value\n';
    
    // Data
    csvContent += `Total Issues,${data.totalIssues}\n`;
    csvContent += `Open Issues,${data.openIssues}\n`;
    csvContent += `Resolved Issues,${data.resolvedIssues}\n`;
    csvContent += `Average Resolution Time (days),${data.avgResolutionTime}\n\n`;
    
    // Status breakdown
    csvContent += 'Status Breakdown\n';
    csvContent += 'Status,Count\n';
    Object.entries(data.byStatus).forEach(([status, count]) => {
      csvContent += `${status},${count}\n`;
    });
    
    csvContent += '\nPriority Breakdown\n';
    csvContent += 'Priority,Count\n';
    Object.entries(data.byPriority).forEach(([priority, count]) => {
      csvContent += `${priority},${count}\n`;
    });
    
    csvContent += '\nCategory Breakdown\n';
    csvContent += 'Category,Count\n';
    Object.entries(data.byCategory).forEach(([category, count]) => {
      csvContent += `${category},${count}\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `issue-analytics-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    
    // Download the data file
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Export successful',
      description: 'Analytics data has been exported to CSV',
    });
  };
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div className="h-8 w-40 bg-gray-200 rounded mb-2"></div>
          <div className="h-10 w-36 bg-gray-200 rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4 h-32"></div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4 h-64"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (isError || !data) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
        <p>Failed to load analytics data. Please try again later.</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics & Reports</h1>
          <p className="text-sm text-gray-500">Insights and statistics about your issues</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2 items-center">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          {/* Sprint MultiSelect */}
          <MultiSelect
            options={sprintOptions.map(s => ({ label: s, value: s }))}
            value={selectedSprints}
            onChange={setSelectedSprints}
            placeholder="Filter by sprint(s)"
            className="w-[200px]"
          />
          <Button 
            variant="outline"
            className="flex items-center"
            onClick={handleExportCSV}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Issues</CardTitle>
            <div className="text-2xl font-bold text-gray-900">{filteredSummary.totalIssues}</div>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">
              {filteredSummary.openIssues} open, {filteredSummary.resolvedIssues} resolved
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Open Rate</CardTitle>
            <div className="text-2xl font-bold text-gray-900">
              {filteredSummary.totalIssues ? Math.round((filteredSummary.openIssues / filteredSummary.totalIssues) * 100) : 0}%
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">
              Based on total open vs. total issues
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Resolution Time</CardTitle>
            <div className="text-2xl font-bold text-gray-900">{filteredSummary.avgResolutionTime} days</div>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">
              Time from open to resolved
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatusChart 
            data={filteredSummary.byStatus} 
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
          
          <CategoryChart 
            data={filteredSummary.byCategory} 
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
          
          <PriorityChart 
            data={filteredSummary.byPriority} 
            timeRange={timeRange}
          />
        </TabsContent>
        
        <TabsContent value="trends" className="grid grid-cols-1 gap-6">
          <TrendChart issues={filteredIssues} isLoading={isLoadingIssues} isError={isErrorIssues} />

          <SprintIssuesChart issues={filteredIssues} />
        </TabsContent>
        
        <TabsContent value="performance" className="grid grid-cols-1 gap-6">
          <ResolutionTimeChart issues={filteredIssues} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
