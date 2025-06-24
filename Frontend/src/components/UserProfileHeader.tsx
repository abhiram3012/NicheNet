
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Star } from 'lucide-react';

interface UserProfileHeaderProps {
  userData: {
    username: string;
    isAnonymous: boolean;
    avatar: string;
    bio: string;
    karma: number;
    joinedDate: string;
  };
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ userData }) => {
  const { username, isAnonymous, avatar, bio, karma, joinedDate } = userData;
  
  const formatJoinDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
              {username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                  {isAnonymous ? 'Anonymous User' : username}
                  {isAnonymous && <Badge variant="secondary">Anonymous</Badge>}
                </h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {formatJoinDate(joinedDate)}
                  </span>
                </div>
              </div>

              {/* Karma Score */}
              <div className="bg-white rounded-lg p-4 border-2 border-orange-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{karma.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Karma Points</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            {bio && (
              <div className="bg-white/70 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">About Me</h3>
                <p className="text-gray-600 leading-relaxed">{bio}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileHeader;
