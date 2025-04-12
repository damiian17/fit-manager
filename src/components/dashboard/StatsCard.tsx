
import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trendValue: string;
}

export const StatsCard = ({ label, value, icon, trendValue }: StatsCardProps) => {
  return (
    <Card className="card-stats overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="stat-label">{label}</p>
            <p className="stat-value">{value}</p>
          </div>
          <div className="rounded-full p-3 bg-fitBlue-100">
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-green-500">
          <TrendingUp className="mr-1 h-4 w-4" />
          <span>{trendValue}</span>
        </div>
      </CardContent>
    </Card>
  );
};
