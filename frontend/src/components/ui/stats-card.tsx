import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ title, value, icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("shadow-card hover:shadow-glow transition-all duration-300", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {trend && (
              <div className="flex items-center space-x-1">
                <span className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-edu-success" : "text-destructive"
                )}>
                  {trend.isPositive ? "↗" : "↘"} {trend.value}
                </span>
              </div>
            )}
          </div>
          <div className="p-3 bg-gradient-primary/10 rounded-full">
            <div className="text-primary">{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}