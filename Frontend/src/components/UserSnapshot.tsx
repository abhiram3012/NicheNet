
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, MessageCircle, Award, TrendingUp } from 'lucide-react';

const UserSnapshot = () => {
  const stats = [
    { label: 'Posts this week', value: 5, icon: Edit, color: 'bg-blue-100 text-blue-700' },
    { label: 'Comments added', value: 23, icon: MessageCircle, color: 'bg-green-100 text-green-700' },
    { label: 'Top post upvotes', value: 127, icon: TrendingUp, color: 'bg-orange-100 text-orange-700' },
  ];

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-800">
          <Award className="w-5 h-5 text-purple-600" />
          <span>Your Weekly Snapshot</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-3 bg-white rounded-lg border border-gray-200">
              <stat.icon className="w-4 h-4 mx-auto mb-1 text-gray-600" />
              <div className="text-xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Activity Streak</span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              🔥 7 days
            </Badge>
          </div>
          
          <div className="text-xs text-gray-600">
            New badges earned: <Badge variant="outline" className="ml-1">First Week Warrior</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSnapshot;
