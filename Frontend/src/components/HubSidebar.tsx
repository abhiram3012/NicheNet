
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock } from 'lucide-react';

interface HubSidebarProps {
  hubData: {
    moderators: string[];
    rules: string[];
    topContributors: Array<{
      username: string;
      posts: number;
    }>;
  };
}

const HubSidebar: React.FC<HubSidebarProps> = ({ hubData }) => {
  const { moderators, rules, topContributors } = hubData;

  return (
    <div className="space-y-6">
      {/* Moderators */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Hub Moderators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {moderators.map((moderator, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{moderator}</span>
                <Badge variant="secondary" className="text-xs">
                  Mod
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Community Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rules.map((rule, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-sm font-medium text-blue-600 min-w-[20px]">
                  {index + 1}.
                </span>
                <span className="text-sm text-gray-700">{rule}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Contributors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Top Contributors This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topContributors.map((contributor, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    #{index + 1}
                  </span>
                  <span className="text-sm text-gray-700">
                    {contributor.username}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {contributor.posts} posts
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Now */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active Now</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-700">89 members online</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HubSidebar;
