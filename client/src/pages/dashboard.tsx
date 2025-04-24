import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import IssueForm from '@/components/issues/IssueForm';
import { ArrowRightIcon } from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

interface DashboardData {
  totalIssues: number;
  openIssues: number;
  inProgressIssues: number;
  completionRate: number;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data, isLoading, isError } = useQuery<DashboardData>({
    queryKey: ['/api/analytics/summary'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/summary');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-40 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        <p>Failed to load dashboard data.</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          New Issue
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <div className="text-sm text-gray-500">Total Issues</div>
          <div className="text-2xl font-semibold">{data.totalIssues || 0}</div>
          <div className="text-xs text-gray-400">Across all projects and categories</div>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="text-sm text-gray-500">Open Issues</div>
          <div className="text-2xl font-semibold">{data.openIssues || 0}</div>
          <div className="text-xs text-gray-400">Waiting to be addressed</div>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="text-sm text-gray-500">In Progress</div>
          <div className="text-2xl font-semibold">{data.inProgressIssues || 0}</div>
          <div className="text-xs text-gray-400">Currently being worked on</div>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="text-sm text-gray-500">Completion</div>
          <div className="text-2xl font-semibold">
            {data.totalIssues ? Math.round(((data.totalIssues - data.openIssues) / data.totalIssues) * 100) : 0}%</div>
          <div className="text-xs text-gray-400">Resolution rate</div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-medium">Recent Issues</h2>
            <p className="text-sm text-gray-500">Latest issues that need attention</p>
          </div>
          <Link href="/issues">
            <Button variant="ghost" className="text-sm">
              View All <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        {data.totalIssues === 0 ? (
          <div className="text-center py-8 text-gray-500">No issues found</div>
        ) : null}
      </Card>

      <IssueForm open={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
};

export default Dashboard;