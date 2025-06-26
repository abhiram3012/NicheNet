
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown, ArrowLeft, Crown, MessageSquare } from 'lucide-react';

const PostDetails = () => {
  const { hubId, postId } = useParams();

  // Mock post data (in real app, this would come from API)
  const post = {
    id: postId,
    title: 'Golden Hour Landscape from Yesterday\'s Hike',
    content: 'Captured this amazing sunset during my hike in the mountains. The lighting was absolutely perfect, and I couldn\'t resist taking this shot. Used a Canon 5D Mark IV with 24-70mm lens. Settings were ISO 100, f/8, 1/125s. The key was waiting for the right moment when the light hit the peaks just right.',
    author: '@naturelover',
    authorAnonymous: false,
    isCreator: false,
    upvotes: 127,
    downvotes: 3,
    commentsCount: 23,
    timePosted: '2h ago',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=center',
    comments: [
      {
        id: '1',
        content: 'Absolutely stunning shot! The colors are incredible. What time did you take this?',
        author: '@photoEnthusiast',
        upvotes: 8,
        timePosted: '1h ago'
      },
      {
        id: '2',
        content: 'Great composition! The foreground rocks really add depth to the image.',
        author: '@landscapePro',
        upvotes: 12,
        timePosted: '45m ago'
      },
      {
        id: '3',
        content: 'Thanks for sharing the camera settings! Really helpful for beginners like me.',
        author: '@learningPhoto',
        upvotes: 5,
        timePosted: '30m ago'
      }
    ]
  };

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
                <Button variant="ghost" size="sm" className="p-1 h-8 w-8 hover:bg-orange-100">
                  <ChevronUp className="w-4 h-4 text-orange-600" />
                </Button>
                <span className="text-sm font-medium text-gray-700">
                  {post.upvotes - post.downvotes}
                </span>
                <Button variant="ghost" size="sm" className="p-1 h-8 w-8 hover:bg-blue-100">
                  <ChevronDown className="w-4 h-4 text-blue-600" />
                </Button>
              </div>

              {/* Post Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${post.isCreator ? 'text-yellow-700' : ''}`}>
                      {post.authorAnonymous ? 'Anonymous' : post.author}
                    </span>
                    {post.isCreator && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Creator
                      </Badge>
                    )}
                  </div>
                  <span>•</span>
                  <span>{post.timePosted}</span>
                </div>

                <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                  {post.title}
                </h1>

                <p className="text-gray-700 mb-4">
                  {post.content}
                </p>

                {post.imageUrl && (
                  <div className="mb-4">
                    <img 
                      src={post.imageUrl} 
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
            <Button className="bg-green-600 hover:bg-green-700">
              Add Comment
            </Button>
          </div>
          
          {post.comments.map((comment) => (
            <Card key={comment.id} className="bg-white">
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
                      <span className="font-medium">{comment.author}</span>
                      <span>•</span>
                      <span>{comment.timePosted}</span>
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
