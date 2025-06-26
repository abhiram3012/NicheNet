import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown, MessageSquare, Crown } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  content: string;
  image?: string;
  isAnonymous: boolean;
  author: {
    _id: string;
    username: string;
  };
  hub: string;
  upvotes: number;
  downvotes: number;
  comments: string[];
  createdAt: string;
  updatedAt: string;
}

interface PostCardProps {
  post: Post;
  hubCreatorId?: boolean; // Optional for showing "Creator" badge
  currentUserId?: string; // Optional if you want to check if current user is creator
}

const PostCard: React.FC<PostCardProps> = ({ post, hubCreatorId }) => {
  const { hubId } = useParams();
  const {
    _id,
    title,
    content,
    image,
    isAnonymous,
    author,
    upvotes,
    downvotes,
    comments,
    createdAt,
  } = post;

  const isCreator = hubCreatorId ;

  const netVotes = upvotes - downvotes;

  const timePosted = new Date(createdAt).toLocaleString(); // You can format this better using dayjs or date-fns

  return (
    <Card
      className={`bg-white hover:shadow-md transition-shadow ${
        isCreator ? 'ring-2 ring-yellow-200 border-yellow-300' : ''
      }`}
    >
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Voting Section */}
          <div className="flex flex-col items-center space-y-1 min-w-[60px]">
            <Button variant="ghost" size="sm" className="p-1 h-8 w-8 hover:bg-orange-100">
              <ChevronUp className="w-4 h-4 text-orange-600" />
            </Button>
            <span className="text-sm font-medium text-gray-700">
              {netVotes}
            </span>
            <Button variant="ghost" size="sm" className="p-1 h-8 w-8 hover:bg-blue-100">
              <ChevronDown className="w-4 h-4 text-blue-600" />
            </Button>
          </div>

          {/* Post Content */}
          <div className="flex-1">
            {/* Author & Timestamp */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <div className="flex items-center gap-2">
                <span className={`font-medium ${isCreator ? 'text-yellow-700' : ''}`}>
                  {isAnonymous ? 'Anonymous' : author.username}
                </span>
                {isCreator && (
                  <Badge className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Creator
                  </Badge>
                )}
              </div>
              <span>•</span>
              <span>{timePosted}</span>
            </div>

            {/* Title */}
            <Link to={`/hub/${hubId}/post/${_id}`}>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 cursor-pointer">
                {title}
              </h3>
            </Link>

            {/* Content */}
            <p className="text-gray-600 mb-3 line-clamp-3">{content}</p>

            {/* Image */}
            {image && (
              <div className="mb-3">
                <img
                  src={`http://localhost:5000${image}`}
                  alt="Post"
                  className="rounded-lg max-w-md h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                />
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
                <MessageSquare className="w-4 h-4" />
                <span>{comments.length} comments</span>
              </Button>

              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                Share
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
