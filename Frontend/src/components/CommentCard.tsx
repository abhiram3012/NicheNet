import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/utils/timeAgo";
import { MessageCircle, SendHorizontal } from "lucide-react";
import axios from "axios";

const CommentCard = ({ comment, postId, onReplySubmit }) => {
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(false); // default to collapsed

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    try {
      await axios.post(
        `http://localhost:5000/api/comments/`,
        {
          postId,
          content: replyContent,
          parentCommentId: comment._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setReplyContent("");
      setReplying(false);
      onReplySubmit(); // Refresh post and its comments
      setShowReplies(true); // Optionally show replies after posting
    } catch (err) {
      console.error("Failed to post reply:", err);
    }
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        <div className="flex flex-col">
          {/* Comment Header */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="font-medium">{comment.author?.username || "Anonymous"}</span>
            <span>•</span>
            <span>{timeAgo(comment.createdAt)}</span>
          </div>

          {/* Comment Content */}
          <p className="text-gray-800 mb-2">{comment.content}</p>

          {/* Reply Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReplying(!replying)}
            className="text-blue-600 w-fit hover:text-blue-800"
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
                    setReplyContent("");
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

          {/* Toggle Immediate Replies */}
          {comment.replies?.length > 0 && (
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowReplies((prev) => !prev)}
              className="mt-2 text-gray-600 hover:text-gray-800"
            >
              {showReplies
                ? "Hide Replies"
                : `Show Replies (${comment.replies.length})`}
            </Button>
          )}

          {/* Only render immediate children if toggled */}
          {showReplies && comment.replies?.length > 0 && (
            <div className="mt-4 pl-4 border-l border-gray-200 space-y-3">
              {comment.replies.map((reply) => (
                <CommentCard
                  key={reply._id}
                  comment={reply}
                  postId={postId}
                  onReplySubmit={onReplySubmit}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentCard;
