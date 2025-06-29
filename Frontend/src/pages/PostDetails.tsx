import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown, ArrowLeft, Crown, MessageSquare, SendHorizontal } from 'lucide-react';
import axios from 'axios';
import { timeAgo } from '@/utils/timeAgo';
import CommentCard from '@/components/CommentCard';

const PostDetails = () => {
  const { hubId, postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [votingLoading, setVotingLoading] = useState(false);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${postId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setPost(res.data);
      } catch (err) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [hubId, postId]);

  const fetchPostAgain = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPost(res.data);
    } catch (err) {
      console.error('Failed to refresh post', err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await axios.post(`http://localhost:5000/api/comments/`, {
        postId,
        content: newComment,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchPostAgain();
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment', err);
    }
  };

  const handleVote = async (type) => {
    if (votingLoading) return;

    setVotingLoading(true);
    try {
      const endpoint = type === 'up'
        ? `http://localhost:5000/api/posts/${postId}/like`
        : `http://localhost:5000/api/posts/${postId}/dislike`;

      await axios.put(endpoint, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      fetchPostAgain();
    } catch (err) {
      console.error('Failed to vote:', err);
    } finally {
      setVotingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-300">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-center">Loading post...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-300">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-center text-red-400">{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Link to={`/hub/${hubId}`}>
            <Button variant="outline" className="mb-4 border-gray-600 text-gray-200 hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Button>
          </Link>
        </div>

        {/* Post Card */}
        <Card className={`bg-gray-800 mb-6 border border-gray-700 ${post.isCreator ? 'ring-2 ring-yellow-500/60 border-yellow-500/50' : ''}`}>
          <CardContent className="p-6">
            <div className="flex gap-4">
              {/* Voting Section */}
              <div className="flex flex-col items-center space-y-1 min-w-[60px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-8 w-8 hover:bg-orange-900/30"
                  disabled={votingLoading}
                  onClick={() => handleVote('up')}
                >
                  <ChevronUp className="w-4 h-4 text-orange-400" />
                </Button>

                <span className="text-sm font-medium text-gray-300">
                  {post.upvotes.length - post.downvotes.length}
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-8 w-8 hover:bg-blue-900/30"
                  disabled={votingLoading}
                  onClick={() => handleVote('down')}
                >
                  <ChevronDown className="w-4 h-4 text-blue-400" />
                </Button>
              </div>

              {/* Post Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${post.isCreator ? 'text-yellow-400' : 'text-gray-200'}`}>
                      {post.isAnonymous ? 'Anonymous' : post.author.username}
                    </span>
                    {post.isCreator && (
                      <Badge className="bg-yellow-900/30 text-yellow-300 text-xs px-2 py-1 flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Creator
                      </Badge>
                    )}
                  </div>
                  <span>•</span>
                  <span>{timeAgo(post.createdAt)}</span>
                </div>

                <h1 className="text-2xl font-semibold text-white mb-4">
                  {post.title}
                </h1>

                <p className="text-gray-300 mb-4">
                  {post.content}
                </p>

                {post.image && (
                  <div className="mb-4">
                    <img 
                      src={`http://localhost:5000${post.image}`} 
                      alt="Post content"
                      className="rounded-lg w-full max-w-2xl object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5" />
            {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
          </h2>

          {/* Main comment input */}
          <div className="bg-gray-800 rounded-md p-4 shadow-sm mb-6 border border-gray-700">
            <textarea
              rows={3}
              placeholder="Write your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border border-gray-600 rounded p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-100"
            />
            <div className="flex justify-end mt-2">
              <Button
                className="bg-green-700 hover:bg-green-600 text-white"
                onClick={handleAddComment}
              >
                <SendHorizontal className="w-4 h-4 mr-2" />
                Post Comment
              </Button>
            </div>
          </div>

          {/* Display each comment */}
          {post.comments.map((comment) => (
            <CommentCard
              postId={postId}
              key={comment._id}
              comment={comment}
              onReplySubmit={fetchPostAgain}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default PostDetails;
