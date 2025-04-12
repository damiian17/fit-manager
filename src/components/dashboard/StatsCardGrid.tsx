
import { Users, Dumbbell, Salad, CalendarCheck } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";

export const StatsCardGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        label="Total Clientes"
        value="128"
        icon={<Users className="h-6 w-6 text-fitBlue-600" />}
        trendValue="+8% este mes"
      />
      
      <StatsCard
        label="Rutinas Activas"
        value="42"
        icon={<Dumbbell className="h-6 w-6 text-fitBlue-600" />}
        trendValue="+12% este mes"
      />
      
      <StatsCard
        label="Dietas Activas"
        value="36"
        icon={<Salad className="h-6 w-6 text-fitBlue-600" />}
        trendValue="+5% este mes"
      />
      
      <StatsCard
        label="Sesiones Completadas"
        value="96"
        icon={<CalendarCheck className="h-6 w-6 text-fitBlue-600" />}
        trendValue="+15% este mes"
      />
    </div>
  );
};
