
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

interface UserBadgesProps {
  badges: BadgeData[];
}

const UserBadges: React.FC<UserBadgesProps> = ({ badges }) => {
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  
  const earnedBadges = badges.filter(badge => badge.earned);
  const totalBadges = badges.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-600" />
          Badges ({earnedBadges.length}/{totalBadges})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="relative"
              onMouseEnter={() => setHoveredBadge(badge.id)}
              onMouseLeave={() => setHoveredBadge(null)}
            >
              <div className={`
                p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                ${badge.earned 
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 hover:shadow-md' 
                  : 'bg-gray-50 border-gray-200 opacity-50'
                }
              `}>
                <div className="text-center">
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <div className="text-xs font-medium text-gray-700 leading-tight">
                    {badge.name}
                  </div>
                </div>
              </div>

              {/* Tooltip */}
              {hoveredBadge === badge.id && (
                <div className="absolute z-10 bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  {badge.description}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {earnedBadges.length > 0 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-sm text-green-700 font-medium">
              🎉 Latest achievement: {earnedBadges[earnedBadges.length - 1].name}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserBadges;
