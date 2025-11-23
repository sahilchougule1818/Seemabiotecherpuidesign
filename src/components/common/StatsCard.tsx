import { Card } from "../ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, className = "" }: StatsCardProps) {
  return (
    <Card className={`p-6 bg-white/80 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[#717182]">{title}</p>
          <h3 className="text-[#555555]">{value}</h3>
          {trend && (
            <p className={`text-sm ${trend.isPositive ? "text-[#4CAF50]" : "text-[#d4183d]"}`}>
              {trend.value}
            </p>
          )}
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#4CAF50]/10 to-[#4CAF50]/5">
          <Icon className="w-6 h-6 text-[#4CAF50]" />
        </div>
      </div>
    </Card>
  );
}
