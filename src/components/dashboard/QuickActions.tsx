
import { Dumbbell, Salad, UserPlus } from "lucide-react";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";

export const QuickActions = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <QuickActionCard
        to="/clients/new"
        icon={<UserPlus className="h-12 w-12 text-fitBlue-600 mb-4" />}
        title="Nuevo Cliente"
        description="Registra un nuevo cliente en el sistema"
      />
      
      <QuickActionCard
        to="/workouts/new"
        icon={<Dumbbell className="h-12 w-12 text-fitBlue-600 mb-4" />}
        title="Nueva Rutina"
        description="Crea una rutina de entrenamiento personalizada"
      />
      
      <QuickActionCard
        to="/diets/new"
        icon={<Salad className="h-12 w-12 text-fitBlue-600 mb-4" />}
        title="Nuevo Plan Dietético"
        description="Genera un plan alimenticio personalizado"
      />
    </div>
  );
};
