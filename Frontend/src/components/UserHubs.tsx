
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Flame, Trophy } from 'lucide-react';

interface HubData {
  id: string;
  name: string;
  role: string;
  karma: number;
}

interface UserHubsProps {
  hubs: HubData[];
  currentStreak: number;
  longestStreak: number;
}

const UserHubs: React.FC<UserHubsProps> = ({ hubs, currentStreak, longestStreak }) => {
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'top commentator':
      case 'discussion leader':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'contributor':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'new member':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Streak Tracker */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <Flame className="w-5 h-5" />
            Activity Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-1">
                🔥 {currentStreak}
              </div>
              <div className="text-sm text-gray-600">Current Streak (days)</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
              <span className="text-sm text-gray-600">Best Streak</span>
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <span className="font-semibold text-gray-800">{longestStreak} days</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Joined Hubs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            My Hubs ({hubs.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {hubs.map((hub) => (
            <div
              key={hub.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-800">{hub.name}</h4>
                <span className="text-sm font-medium text-gray-600">
                  {hub.karma} karma
                </span>
              </div>
              
              <Badge 
                variant="outline" 
                className={`text-xs ${getRoleColor(hub.role)}`}
              >
                {hub.role}
              </Badge>
            </div>
          ))}
          
          <div className="pt-2 border-t border-gray-200">
            <div className="text-sm text-gray-600 text-center">
              Total Hub Karma: <span className="font-semibold text-gray-800">
                {hubs.reduce((sum, hub) => sum + hub.karma, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserHubs;
