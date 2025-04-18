
import { DayWorkout } from "@/types/workout";
import { ExerciseCard } from "./ExerciseCard";
import { Dumbbell } from "lucide-react";

interface WorkoutDayProps {
  day: DayWorkout;
}

export const WorkoutDay = ({ day }: WorkoutDayProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Dumbbell className="h-5 w-5 text-fitBlue-600" />
        <h3 className="text-xl font-semibold">{day.Día}</h3>
      </div>
      <div className="space-y-4">
        {day.Ejercicios.map((exercise, index) => (
          <ExerciseCard key={index} exercise={exercise} />
        ))}
      </div>
    </div>
  );
};
