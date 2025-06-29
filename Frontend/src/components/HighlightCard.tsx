import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface HighlightCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'purple';
  trend?: 'up' | 'down' | 'stable';
}

const HighlightCard: React.FC<HighlightCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  color,
  trend
}) => {
  const colorClasses = {
    blue: 'bg-blue-900 text-blue-300 border-blue-700',
    green: 'bg-green-900 text-green-300 border-green-700',
    orange: 'bg-orange-900 text-orange-300 border-orange-700',
    purple: 'bg-purple-900 text-purple-300 border-purple-700',
  };

  const iconColorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    orange: 'text-orange-400',
    purple: 'text-purple-400',
  };

  return (
    <Card className={`${colorClasses[color]} border hover:shadow-lg transition-shadow`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between text-gray-200">
          {title}
          <Icon className={`w-4 h-4 ${iconColorClasses[color]}`} />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          <div className="text-2xl font-bold text-white">{value}</div>
          {description && (
            <p className="text-xs text-gray-400">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HighlightCard;
