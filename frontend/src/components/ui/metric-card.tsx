import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
  trendDirection?: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgGradient: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendDirection = 'up',
  icon: Icon,
  color,
  bgGradient,
  className
}) => {
  return (
    <Card className={cn(
      'group relative overflow-hidden border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1',
      className
    )}>
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500',
        bgGradient
      )} />
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn('p-3 rounded-2xl shadow-lg', color)}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <Badge 
              variant="secondary" 
              className={cn(
                'text-xs',
                trendDirection === 'up' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              )}
            >
              {trendDirection === 'up' ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {trend}
            </Badge>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {title}
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
