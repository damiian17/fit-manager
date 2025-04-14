
import { Workout } from "@/services/supabaseService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface WorkoutDetailViewProps {
  workout: Workout;
  onBack: () => void;
}

export const WorkoutDetailView = ({ workout, onBack }: WorkoutDetailViewProps) => {
  return (
    <Card>
      <CardHeader>
        <Button variant="ghost" onClick={onBack} className="w-fit p-0 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <CardTitle>{workout.name}</CardTitle>
        <CardDescription>
          Rutina de entrenamiento personalizada
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* This is a placeholder for workout details */}
          {/* When the workout generator is implemented, this can be expanded */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-center text-gray-500 dark:text-gray-400">
              Los detalles de esta rutina estarán disponibles próximamente.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
