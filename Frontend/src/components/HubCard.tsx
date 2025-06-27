import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Users, Clock, TrendingUp, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HubCardProps } from '@/utils/mapHubToCardProps';

const HubCard: React.FC<HubCardProps> = ({
  id,
  name,
  description,
  memberCount,
  newPosts,
  lastActive,
  activeUsers,
  isJoined,
  isPrivate,
  isCreator,
  category,
  imageUrl
}) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"
              style={imageUrl ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover' } : {}}
            >
              {!imageUrl && (
                <span className="text-white font-bold text-lg">
                  {name[0].toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {category}
              </p>
            </div>
          </div>
          {isCreator ? (
            <Link to={`/hub/${id}/admin`}>
              <Button 
                size="sm" 
                className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white"
              >
                <Settings className="w-3 h-3 mr-1" />
                Admin
              </Button>
            </Link>
          ) : (
            <Button 
              variant={isJoined ? "secondary" : "default"} 
              size="sm"
              className={isJoined 
                ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50" 
                : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"}
            >
              {isJoined ? "Joined" : "Join"}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 text-orange-500 dark:text-orange-400" />
            <span>{newPosts} new posts</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-blue-500 dark:text-blue-400" />
            <span>Active {lastActive}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3 text-green-500 dark:text-green-400" />
            <span>{memberCount.toLocaleString()} members</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>{activeUsers} active now</span>
          </div>
        </div>
        
        <Link to={isPrivate && !isJoined ? `/hub/${id}/join-request` : `/hub/${id}`}>
          <Button 
            variant="outline" 
            className="w-full group-hover:bg-blue-50 group-hover:border-blue-300 dark:group-hover:bg-blue-900/30 dark:group-hover:border-blue-500 transition-colors border-gray-300 dark:border-gray-600"
          >
            {isPrivate && !isJoined ? 'Request to Join' : 'Enter Hub'}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default HubCard;