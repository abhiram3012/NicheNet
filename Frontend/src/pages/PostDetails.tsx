
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown, ArrowLeft, Crown, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios'; // Install this if not already
import { timeAgo } from '@/utils/timeAgo';

const PostDetails = () => {
  const { hubId, postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${postId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is in localStorage
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
  } catch (err) {
    console.error('Failed to refresh post', err);
  }
};

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(`http://localhost:5000/api/comments/`, {
        postId,
        content: newComment, 
      },{headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is in localStorage
      }});
      fetchPostAgain(); // Refresh the post to include the new comment
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment', err);
    }
  };

  const handleVote = async (type) => {
    if (loading) return;

    setLoading(true);
    try {
      const endpoint = type === 'up' ? `http://localhost:5000/api/posts/${postId}/like` : `http://localhost:5000/api/posts/${postId}/dislike`;
      const token = localStorage.getItem('token');
      await axios.put(endpoint, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchPostAgain(); // refetch or update the post after vote
    } catch (err) {
      console.error('Failed to vote:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-center text-gray-500">Loading post...</p>
      </main>
    </div>
  );
}

if (error) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-center text-red-500">{error}</p>
      </main>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Link to={`/hub/${hubId}`}>
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Button>
          </Link>
        </div>

        {/* Post Card */}
        <Card className={`bg-white mb-6 ${post.isCreator ? 'ring-2 ring-yellow-200 border-yellow-300' : ''}`}>
          <CardContent className="p-6">
            <div className="flex gap-4">
              {/* Voting Section */}
              <div className="flex flex-col items-center space-y-1 min-w-[60px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-1 h-8 w-8 hover:bg-orange-100`}
                  disabled={loading}
                  onClick={() => handleVote('up')}
                >
                  <ChevronUp className="w-4 h-4 text-orange-600" />
                </Button>

                <span className="text-sm font-medium text-gray-700">
                  {post.upvotes.length - post.downvotes.length}
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-1 h-8 w-8 hover:bg-blue-100`}
                  disabled={loading}
                  onClick={() => handleVote('down')}
                >
                  <ChevronDown className="w-4 h-4 text-blue-600" />
                </Button>
              </div>

              {/* Post Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${post.isCreator ? 'text-yellow-700' : ''}`}>
                      {post.isAnonymous ? 'Anonymous' : post.author.username}
                    </span>
                    {post.isCreator && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Creator
                      </Badge>
                    )}
                  </div>
                  <span>•</span>
                  <span>{timeAgo(post.createdAt)}</span>
                </div>

                <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                  {post.title}
                </h1>

                <p className="text-gray-700 mb-4">
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
            </h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="border px-3 py-2 rounded w-full"
              />
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleAddComment}>
                Add Comment
              </Button>
            </div>
          </div>
          
          {post.comments.map((comment) => (
            <Card key={comment._id} className="bg-white">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center space-y-1">
                    <Button variant="ghost" size="sm" className="p-1 h-6 w-6 hover:bg-orange-100">
                      <ChevronUp className="w-3 h-3 text-orange-600" />
                    </Button>
                    <span className="text-xs font-medium text-gray-600">{comment.upvotes}</span>
                    <Button variant="ghost" size="sm" className="p-1 h-6 w-6 hover:bg-blue-100">
                      <ChevronDown className="w-3 h-3 text-blue-600" />
                    </Button>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <span className="font-medium">{comment.author.username}</span>
                      <span>•</span>
                      <span>{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PostDetails;
