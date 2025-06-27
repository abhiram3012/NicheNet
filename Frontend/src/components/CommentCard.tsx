import axios from "axios";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from '@/components/ui/button';
import { timeAgo } from "@/utils/timeAgo";
import { MessageCircle, SendHorizontal } from "lucide-react";

const CommentCard = ({ comment, onReplySubmit }) => {
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    try {
      await axios.post(`http://localhost:5000/api/comments/reply`, {
        commentId: comment._id,
        content: replyContent,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setReplyContent('');
      setReplying(false);
      onReplySubmit(); // refresh
    } catch (err) {
      console.error('Failed to post reply:', err);
    }
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Comment Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span className="font-medium">{comment.author.username}</span>
              <span>•</span>
              <span>{timeAgo(comment.createdAt)}</span>
            </div>
            <p className="text-gray-800 mb-2">{comment.content}</p>

            {/* Reply Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplying((prev) => !prev)}
              className="text-blue-600 hover:text-blue-800"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Reply
            </Button>

            {/* Reply Input */}
            {replying && (
              <div className="mt-3">
                <textarea
                  rows={2}
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReplying(false);
                      setReplyContent('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                    onClick={handleReply}
                  >
                    <SendHorizontal className="w-4 h-4 mr-2" />
                    Post Reply
                  </Button>
                </div>
              </div>
            )}

            {/* Replies List (Optional if available in backend) */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 pl-4 border-l border-gray-200 space-y-3">
                {comment.replies.map((reply) => (
                  <div key={reply._id} className="text-sm text-gray-700">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <span className="font-medium">{reply.author.username}</span>
                      <span>•</span>
                      <span>{timeAgo(reply.createdAt)}</span>
                    </div>
                    <p>{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentCard;