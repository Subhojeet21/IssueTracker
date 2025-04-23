import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Comment } from '@shared/schema';
import { formatDateTime, getInitials } from '@/lib/utils';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  isSubmitting?: boolean;
}

const CommentSection = ({ 
  comments, 
  onAddComment,
  isSubmitting = false 
}: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('');
  
  // Map user IDs to names (in a real app, this would come from the API)
  const userNames: Record<number, string> = {
    1: 'John Doe',
    2: 'Alex Taylor',
    3: 'Jordan Smith',
    4: 'Casey Jones',
  };
  
  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No comments yet</p>
              <p className="text-sm">Be the first to add a comment</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(userNames[comment.userId] || 'Unknown')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {userNames[comment.userId] || 'Unknown'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDateTime(comment.createdAt)}
                    </span>
                  </div>
                  <div className="text-gray-700 whitespace-pre-line">{comment.content}</div>
                </div>
              </div>
            ))
          )}
          
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Add a comment</h3>
            <div className="space-y-3">
              <Textarea
                placeholder="Type your comment here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmit} 
                  disabled={!newComment.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentSection;
