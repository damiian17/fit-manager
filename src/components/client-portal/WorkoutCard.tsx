
import { Workout } from "@/services/supabaseService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface WorkoutCardProps {
  workout: Workout;
  onViewDetails: (workout: Workout) => void;
}

export const WorkoutCard = ({ workout, onViewDetails }: WorkoutCardProps) => {
  const formattedDate = workout.created_at 
    ? format(new Date(workout.created_at), "d 'de' MMMM, yyyy", { locale: es })
    : "Fecha desconocida";

  // Extract workout type or difficulty if available
  const workoutType = workout.form_data?.workoutType || "Entrenamiento";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{workout.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <CalendarDays className="h-3 w-3 mr-1" />
              {formattedDate}
            </CardDescription>
          </div>
          <Badge variant="secondary">
            {workoutType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {workout.workout_data && typeof workout.workout_data === 'object'
              ? "Rutina personalizada"
              : "Detalles no disponibles"}
          </p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center text-fitBlue-600"
            onClick={() => onViewDetails(workout)}
          >
            Ver detalles
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
