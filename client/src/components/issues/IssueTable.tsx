import { useState } from 'react';
import { Link } from 'wouter';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Eye, Edit, UserPlus } from 'lucide-react';
import IssueStatusBadge from '@/components/dashboard/IssueStatusBadge';
import IssuePriorityBadge from '@/components/dashboard/IssuePriorityBadge';
import { Issue } from '@shared/schema';
import { formatDate, generateIssueId, getInitials } from '@/lib/utils';
import { CATEGORY_LABELS, TEAM_LABELS, ENVIRONMENT_LABELS } from '@/lib/constants';

interface IssueTableProps {
  issues: Issue[];
  isLoading?: boolean;
}

const IssueTable = ({ issues, isLoading = false }: IssueTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  
  // Calculate pagination
  const totalPages = Math.ceil(issues.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedIssues = issues.slice(startIndex, startIndex + perPage);
  
  if (isLoading) {
    return (
      <div className="flex flex-col space-y-3">
        <div className="skeleton h-8 w-full bg-gray-200 animate-pulse rounded-md"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton h-16 w-full bg-gray-200 animate-pulse rounded-md"></div>
        ))}
      </div>
    );
  }
  
  return (
    <div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {/*<TableHead className="w-20">ID</TableHead>*/}
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Environment</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedIssues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No issues found
                </TableCell>
              </TableRow>
            ) : (
              paginatedIssues.map((issue) => (
                <TableRow key={issue.id} className="hover:bg-gray-50">
                  {/*<TableCell className="font-medium text-primary">
                    {generateIssueId(issue.id)}
                  </TableCell>*/}
                  <TableCell className="max-w-xs truncate">
                    {issue.title}
                  </TableCell>
                  <TableCell>
                    <IssueStatusBadge status={issue.status} />
                  </TableCell>
                  <TableCell>
                    <IssuePriorityBadge priority={issue.priority} />
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {CATEGORY_LABELS[issue.category]}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {TEAM_LABELS[issue.team]}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {ENVIRONMENT_LABELS[issue.environment]}
                  </TableCell>
                  <TableCell>
                    {issue.assigneeId ? (
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium text-sm">
                          {issue.assigneeId === 1 ? 'S' : 
                           issue.assigneeId === 2 ? 'T' : 
                           issue.assigneeId === 3 ? 'A' : 'M'}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-900 whitespace-nowrap">
                            {issue.assigneeId === 1 ? 'Subhojeet' : 
                             issue.assigneeId === 2 ? 'Tariq' : 
                             issue.assigneeId === 3 ? 'Anjireddy' : 'Manohar'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {formatDate(issue.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/issues/${issue.id}`} className="inline-block">
                        <Button variant="ghost" size="icon" className="text-primary hover:text-primary-dark">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {/*<Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                        <UserPlus className="h-4 w-4" />
                      </Button>*/}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(startIndex + perPage, issues.length)}
                </span>{" "}
                of <span className="font-medium">{issues.length}</span> issues
              </p>
            </div>
            <Pagination>
              <PaginationContent>
                {currentPage > 1 ? (
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    />
                  </PaginationItem>
                ) : (
                  <PaginationItem className="opacity-50">
                    <PaginationPrevious onClick={() => {}} />
                  </PaginationItem>
                )}
                
                {/* Generate page numbers */}
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  let pageNum = i + 1;
                  
                  // If we have more than 5 pages and we're not at the beginning
                  if (totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 3 + i;
                    
                    // Don't go beyond the total pages
                    if (pageNum > totalPages) {
                      pageNum = totalPages - (4 - i);
                    }
                  }
                  
                  // Don't show pages beyond the total
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={currentPage === pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {currentPage < totalPages ? (
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    />
                  </PaginationItem>
                ) : (
                  <PaginationItem className="opacity-50">
                    <PaginationNext onClick={() => {}} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueTable;
