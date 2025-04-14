
import { Users, Dumbbell, Salad, CalendarCheck } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";

interface StatsCardGridProps {
  stats: {
    totalClients: number;
    activeWorkouts: number;
    activeDiets: number;
    completedSessions: number;
  }
}

export const StatsCardGrid = ({ stats }: StatsCardGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        label="Total Clientes"
        value={stats.totalClients.toString()}
        icon={<Users className="h-6 w-6 text-fitBlue-600" />}
        trendValue={stats.totalClients > 0 ? "Nuevos clientes" : "Añade tu primer cliente"}
      />
      
      <StatsCard
        label="Rutinas Activas"
        value={stats.activeWorkouts.toString()}
        icon={<Dumbbell className="h-6 w-6 text-fitBlue-600" />}
        trendValue={stats.activeWorkouts > 0 ? "Rutinas activas" : "Crea tu primera rutina"}
      />
      
      <StatsCard
        label="Dietas Activas"
        value={stats.activeDiets.toString()}
        icon={<Salad className="h-6 w-6 text-fitBlue-600" />}
        trendValue={stats.activeDiets > 0 ? "Dietas activas" : "Crea tu primera dieta"}
      />
      
      <StatsCard
        label="Sesiones Completadas"
        value={stats.completedSessions.toString()}
        icon={<CalendarCheck className="h-6 w-6 text-fitBlue-600" />}
        trendValue={stats.completedSessions > 0 ? "Sesiones completadas" : "Sin sesiones aún"}
      />
    </div>
  );
};
