
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface ActivityHeatmapProps {
  userId: string;
}

const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ userId }) => {
  // Generate mock activity data for the last 365 days
  const generateActivityData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate random activity level (0-4)
      const activity = Math.floor(Math.random() * 5);
      
      data.push({
        date: date.toISOString().split('T')[0],
        count: activity,
        level: activity
      });
    }
    
    return data;
  };

  const activityData = generateActivityData();
  const weeks = [];
  
  // Group data into weeks
  for (let i = 0; i < activityData.length; i += 7) {
    weeks.push(activityData.slice(i, i + 7));
  }

  const getColorClass = (level: number) => {
    switch (level) {
      case 0: return 'bg-gray-100';
      case 1: return 'bg-green-200';
      case 2: return 'bg-green-300';
      case 3: return 'bg-green-500';
      case 4: return 'bg-green-700';
      default: return 'bg-gray-100';
    }
  };

  const totalContributions = activityData.filter(day => day.count > 0).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-600" />
          Activity Overview
        </CardTitle>
        <p className="text-sm text-gray-600">
          {totalContributions} contributions in the last year
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={day.date}
                    className={`w-3 h-3 rounded-sm ${getColorClass(day.level)} hover:ring-2 hover:ring-green-400 cursor-pointer transition-all`}
                    title={`${day.date}: ${day.count} contributions`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-between mt-4 text-xs text-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getColorClass(level)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityHeatmap;
