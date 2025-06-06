import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Issue, Attachment } from '@shared/schema';
import IssueStatusBadge from '@/components/dashboard/IssueStatusBadge';
import IssuePriorityBadge from '@/components/dashboard/IssuePriorityBadge';
import { getStatusOptions, getPriorityOptions, getInitials, getCategoryIcon, getCategoryOptions } from '@/lib/utils';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/constants';
import { FileText, Paperclip } from 'lucide-react';

interface IssueDetailProps {
  issue: Issue;
  attachments: Attachment[];
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
  onAssigneeChange: (assigneeId: number | null) => void;
  onCategoryChange: (category: string) => void;
  isPending?: boolean;
}

const IssueDetail = ({ 
  issue, 
  attachments, 
  onStatusChange, 
  onPriorityChange, 
  onAssigneeChange,
  onCategoryChange,
  isPending = false
}: IssueDetailProps) => {
  const [selectedTab, setSelectedTab] = useState('details');
  
  // Map user IDs to names (in a real app, this would come from the API)
  const userNames: Record<number, string> = {
    1: 'Subhojeet',
    2: 'Tariq',
    3: 'Anjireddy',
    4: 'Manohar',
    5: 'Testing Team',
  };
  
  const reporterName = issue.reporterId ? userNames[issue.reporterId] || 'Unknown' : 'Unknown';
  const assigneeName = issue.assigneeId ? userNames[issue.assigneeId] || 'Unassigned' : 'Unassigned';
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">{issue.title}</CardTitle>
      </CardHeader>
      <CardContent >
        <Tabs value={selectedTab} onValueChange={setSelectedTab} >
          <TabsList className="mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="attachments">
              Attachments
              {attachments.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {attachments.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <div>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <Select 
                  defaultValue={issue.status} 
                  onValueChange={onStatusChange}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getStatusOptions().map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                 <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                <Select 
                  defaultValue={issue.priority} 
                  onValueChange={onPriorityChange}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getPriorityOptions().map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                 <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
                <Select 
                  defaultValue={issue.assigneeId?.toString() || 'unassigned'} 
                  onValueChange={(value) => onAssigneeChange(value !== 'unassigned' ? parseInt(value) : null)}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    <SelectItem value="1">Subhojeet</SelectItem>
                    <SelectItem value="2">Tariq</SelectItem>
                    <SelectItem value="3">Anjireddy</SelectItem>
                    <SelectItem value="4">Manohar</SelectItem>
                    <SelectItem value="5">Testing Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                 <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <Select 
                  defaultValue={issue.category} 
                  onValueChange={onCategoryChange}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCategoryOptions().map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              </div>
            </div>
            <div className="mt-4">
             
              <div className="flex items-center gap-2">
                {/*<Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                  <i className={`fas fa-${getCategoryIcon(issue.category)} mr-1`}></i>
                  {CATEGORY_LABELS[issue.category]}
                </Badge>*/}
                <Badge className={`${CATEGORY_COLORS[issue.category]} hover:bg-gray-200`}>
                  <i className={`fas fa-${getCategoryIcon(issue.category)} mr-1`}></i>
                  {CATEGORY_LABELS[issue.category]}
                </Badge>
                
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <span>Reported by</span>
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {getInitials(reporterName)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{reporterName}</span>
                </div>
              </div>
              
              <div className="mt-2" >
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <div className="text-gray-700 whitespace-pre-wrap break-words break-all overflow-x-hidden">
                  {issue.description}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="attachments">
            {attachments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Paperclip className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No attachments for this issue</p>
              </div>
            ) : (
              <div className="space-y-3">
                {attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50">
                    <div className="bg-gray-100 p-2 rounded">
                      <FileText className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {attachment.filename}
                      </p>
                      <p className="text-xs text-gray-500">
                        Uploaded by {userNames[attachment.uploaderId] || 'Unknown'}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => {                        
                        window.open(`/api/download/${attachment.id}`, '_blank');
                      }}>
                      <i className="fas fa-download mr-1"></i>
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IssueDetail;
