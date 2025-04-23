import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/dashboard/StatCard';
import { StatusChart, CategoryChart } from '@/components/dashboard/Charts';
import IssueTable from '@/components/issues/IssueTable';
import IssueForm from '@/components/issues/IssueForm';
import { Issue } from '@shared/schema';

interface DashboardData {
  totalIssues: number;
  openIssues: number;
  resolvedIssues: number;
  avgResolutionTime: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  byCategory: Record<string, number>;
  recentIssues: Issue[];
}

const Dashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [statusTimeRange, setStatusTimeRange] = useState('7');
  const [categoryTimeRange, setCategoryTimeRange] = useState('7');
  
  const { data, isLoading, isError } = useQuery<DashboardData>({
    queryKey: ['/api/analytics/summary'],
  });
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <div className="h-8 w-40 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-60 bg-gray-200 rounded"></div>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="h-10 w-36 bg-gray-200 rounded"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4 h-32"></div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4 h-64"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (isError || !data) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
        <p>Failed to load dashboard data. Please try again later.</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Overview of issues and current status</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            className="bg-primary hover:bg-primary-dark flex items-center"
            onClick={() => setIsFormOpen(true)}
          >
            <i className="fas fa-plus mr-2"></i>
            Create Issue
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Issues"
          value={data.totalIssues}
          icon="clipboard-list"
          iconBgColor="bg-blue-100 text-primary"
          change={{ value: 12, isIncrease: true }}
        />
        
        <StatCard
          title="Open Issues"
          value={data.openIssues}
          icon="exclamation-circle"
          iconBgColor="bg-yellow-100 text-warning"
          change={{ value: 5, isIncrease: true }}
        />
        
        <StatCard
          title="Resolved Issues"
          value={data.resolvedIssues}
          icon="check-circle"
          iconBgColor="bg-green-100 text-success"
          change={{ value: 18, isIncrease: true }}
        />
        
        <StatCard
          title="Avg. Resolution Time"
          value={`${data.avgResolutionTime}d`}
          icon="clock"
          iconBgColor="bg-purple-100 text-purple-600"
          change={{ value: 8, isIncrease: false }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <StatusChart 
          data={data.byStatus} 
          timeRange={statusTimeRange}
          onTimeRangeChange={setStatusTimeRange}
        />
        
        <CategoryChart 
          data={data.byCategory} 
          timeRange={categoryTimeRange}
          onTimeRangeChange={setCategoryTimeRange}
        />
      </div>
      
      <Card className="mb-6">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Recent Issues</h3>
          <Button variant="link" className="text-primary hover:text-primary-dark">
            View All
          </Button>
        </div>
        <CardContent className="p-0">
          <IssueTable issues={data.recentIssues} />
        </CardContent>
      </Card>
      
      <IssueForm open={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
};

export default Dashboard;
