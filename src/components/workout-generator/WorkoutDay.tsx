
import { DayWorkout } from "@/types/workout";
import { ExerciseCard } from "./ExerciseCard";
import { Dumbbell } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface WorkoutDayProps {
  day: DayWorkout;
}

export const WorkoutDay = ({ day }: WorkoutDayProps) => {
  // Use a consistent property name regardless of what came from API
  const dayTitle = day.Dia || day.Día || "Día de entrenamiento";
  
  return (
    <AccordionItem value={dayTitle}>
      <AccordionTrigger className="hover:bg-gray-50 px-4 py-3 rounded-lg">
        <div className="flex items-center gap-2 text-left">
          <Dumbbell className="h-5 w-5 text-fitBlue-600" />
          <h3 className="text-xl font-semibold">{dayTitle}</h3>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pt-2 pb-4">
        <div className="space-y-4">
          {day.Ejercicios.map((exercise, index) => (
            <ExerciseCard key={index} exercise={exercise} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
