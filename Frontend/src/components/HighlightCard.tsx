
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
    blue: 'bg-blue-100 text-blue-600 border-blue-200',
    green: 'bg-green-100 text-green-600 border-green-200',
    orange: 'bg-orange-100 text-orange-600 border-orange-200',
    purple: 'bg-purple-100 text-purple-600 border-purple-200',
  };

  const iconColorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    orange: 'text-orange-500',
    purple: 'text-purple-500',
  };

  return (
    <Card className={`${colorClasses[color]} hover:shadow-md transition-shadow`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          {title}
          <Icon className={`w-4 h-4 ${iconColorClasses[color]}`} />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p className="text-xs opacity-75">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HighlightCard;
