
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Edit, ChevronUp, Clock } from 'lucide-react';

interface UserActivityProps {
  userId: string;
}

const UserActivity: React.FC<UserActivityProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('posts');

  // Mock activity data
  const posts = [
    {
      id: '1',
      title: 'My first macro photography attempt - any tips?',
      hub: 'Photography Hub',
      upvotes: 24,
      comments: 8,
      timeAgo: '2 days ago'
    },
    {
      id: '2',
      title: 'Successfully grew tomatoes from seed this year!',
      hub: 'Urban Gardening',
      upvotes: 15,
      comments: 12,
      timeAgo: '5 days ago'
    },
    {
      id: '3',
      title: 'Homemade sourdough bread recipe that actually works',
      hub: 'Home Cooking',
      upvotes: 31,
      comments: 6,
      timeAgo: '1 week ago'
    }
  ];

  const comments = [
    {
      id: '1',
      content: 'Great shot! For macro photography, I recommend using a tripod and manual focus for better control.',
      postTitle: 'Beginner macro lens recommendations?',
      hub: 'Photography Hub',
      upvotes: 7,
      timeAgo: '1 day ago'
    },
    {
      id: '2',
      content: 'I had the same issue with my tomatoes last year. Make sure you\'re checking the soil pH - it makes a huge difference!',
      postTitle: 'Why are my tomato leaves turning yellow?',
      hub: 'Urban Gardening',
      upvotes: 3,
      timeAgo: '3 days ago'
    },
    {
      id: '3',
      content: 'This is exactly what I needed! I\'ve been struggling with sourdough for months. Thank you for sharing!',
      postTitle: 'Sourdough starter troubleshooting guide',
      hub: 'Home Cooking',
      upvotes: 12,
      timeAgo: '4 days ago'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit className="w-5 h-5 text-gray-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Posts ({posts.length})
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Comments ({comments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-3 mt-4">
            {posts.map((post) => (
              <div key={post.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-800 hover:text-blue-600 cursor-pointer line-clamp-2">
                    {post.title}
                  </h4>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {post.hub}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.timeAgo}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <ChevronUp className="w-4 h-4 text-orange-500" />
                      {post.upvotes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                      {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="comments" className="space-y-3 mt-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                <p className="text-gray-700 mb-3 line-clamp-2">{comment.content}</p>
                
                <div className="text-sm text-gray-500 mb-2">
                  Commented on: <span className="font-medium text-gray-700 hover:text-blue-600 cursor-pointer">
                    {comment.postTitle}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {comment.hub}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {comment.timeAgo}
                    </span>
                  </div>
                  
                  <span className="flex items-center gap-1">
                    <ChevronUp className="w-4 h-4 text-orange-500" />
                    {comment.upvotes}
                  </span>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserActivity;
