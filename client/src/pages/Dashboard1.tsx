
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, ArrowUpRight } from 'lucide-react';
import { IssueItem } from '@/components/issues/IssueItem';
import { getIssuesFromDB } from '@/lib/db';
import { Issue } from '@/types/issue';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Fetching issues from API or database...");
        const issuesData = await getIssuesFromDB();
        setIssues(issuesData);
      } catch (error: any) {
        console.error('Error fetching issues:', error);
        setError('Failed to load issues. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to load issues. Please check your network connection.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // Filter recent issues (last 5)
  const recentIssues = [...issues].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  // Count issues by status for stats
  const statusCounts = issues.reduce((acc, issue) => {
    acc[issue.status] = (acc[issue.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalIssues = issues.length;
  const openIssues = statusCounts['open'] || 0;
  const inProgressIssues = statusCounts['inProgress'] || 0;
  const doneIssues = statusCounts['done'] || 0;

  // Calculate completion percentage for progress bar
  const completionPercentage = totalIssues > 0 ? Math.round((doneIssues / totalIssues) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button 
          onClick={() => navigate('/issues/new')}
          className="mt-4 sm:mt-0"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Issue
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              <p>{error}</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalIssues}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all projects and categories
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{openIssues}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Waiting to be addressed
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressIssues}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Currently being worked on
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completionPercentage}%</div>
                <Progress value={completionPercentage} className="mt-2" />
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Issues */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Issues</CardTitle>
                <CardDescription>
                  Latest issues that need attention
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/issues')}>
                View All
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentIssues.map(issue => (
                  <IssueItem 
                    key={issue._id.toString()} 
                    issue={issue}
                    onClick={() => navigate(`/issues/${issue._id}`)}
                  />
                ))}
                {recentIssues.length === 0 && (
                  <div className="text-center p-4">
                    <p className="text-muted-foreground">No issues found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;
