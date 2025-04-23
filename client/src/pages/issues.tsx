import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import IssueTable from '@/components/issues/IssueTable';
import IssueForm from '@/components/issues/IssueForm';
import { useIssues } from '@/hooks/use-issues';

const Issues = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { issues, isLoading } = useIssues();
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Issues</h1>
          <p className="text-sm text-gray-500">View and manage all issues</p>
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
