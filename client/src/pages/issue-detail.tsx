import { useEffect } from 'react';
import { useIssueById } from '@/hooks/use-issues';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Comment, Attachment } from '@shared/schema';
import IssueDetail from '@/components/issues/IssueDetail';
import CommentSection from '@/components/issues/CommentSection';
import { formatDate, generateIssueId } from '@/lib/utils';

interface IssueDetailPageProps {
  id: number;
}

const IssueDetailPage = ({ id }: IssueDetailPageProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { 
    data: issue, 
    isLoading, 
    isError,
    error 
  } = useIssueById(id);
  
  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: [`/api/issues/${id}/comments`],
    enabled: !!id,
  });
  
  const { data: attachments = [] } = useQuery<Attachment[]>({
    queryKey: [`/api/issues/${id}/attachments`],
    enabled: !!id,
  });
  
  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest('POST', `/api/issues/${id}/comments`, {
        content,
        userId: user?.id || 1,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/issues/${id}/comments`] });
      toast({
        title: 'Comment added',
        description: 'Your comment has been added successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add comment',
        variant: 'destructive',
      });
    },
  });
  
  const updateIssueMutation = useMutation({
    mutationFn: async (updateData: any) => {
      const response = await apiRequest('PATCH', `/api/issues/${id}`, updateData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/issues/${id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/issues'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/summary'] });
      toast({
        title: 'Issue updated',
        description: 'The issue has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update issue',
        variant: 'destructive',
      });
    },
  });
  
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load issue details',
        variant: 'destructive',
      });
    }
  }, [error, toast]);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/issues">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Skeleton className="h-8 w-40" />
        </div>
        
        <Card className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mt-6">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
            <Skeleton className="h-32 mt-4" />
          </div>
        </Card>
        
        <Card className="p-6">
          <Skeleton className="h-8 w-40 mb-4" />
          <Skeleton className="h-24" />
        </Card>
      </div>
    );
  }
  
  if (isError || !issue) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        <h2 className="text-lg font-semibold mb-2">Error Loading Issue</h2>
        <p>We couldn't load the issue details. Please try again later.</p>
        <Button className="mt-4" variant="outline" asChild>
          <Link href="/issues">Back to Issues</Link>
        </Button>
      </div>
    );
  }
  
  const handleStatusChange = (status: string) => {
    updateIssueMutation.mutate({ status });
  };
  
  const handlePriorityChange = (priority: string) => {
    updateIssueMutation.mutate({ priority });
  };
  
  const handleCategoryChange = (category: string) => {
    updateIssueMutation.mutate({ category });
  };
  
  const handleAssigneeChange = (assigneeId: number | null) => {
    updateIssueMutation.mutate({ 
      assigneeId: assigneeId === null ? null : assigneeId 
    });
  };
  
  const handleAddComment = (content: string) => {
    if (content.trim()) {
      addCommentMutation.mutate(content);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/issues">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {generateIssueId(issue.id)}
          </h1>
        </div>
        <div className="text-sm text-gray-500 mt-2 sm:mt-0">
          Created on {formatDate(issue.createdAt)}
        </div>
      </div>
      
      <IssueDetail 
        issue={issue} 
        attachments={attachments}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
        onAssigneeChange={handleAssigneeChange}
        onCategoryChange={handleCategoryChange}
        isPending={updateIssueMutation.isPending}
      />
      
      <CommentSection 
        comments={comments}
        onAddComment={handleAddComment}
        isSubmitting={addCommentMutation.isPending}
      />
    </div>
  );
};

export default IssueDetailPage;
