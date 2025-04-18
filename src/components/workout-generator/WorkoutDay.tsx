
import { DayWorkout } from "@/types/workout";
import { ExerciseCard } from "./ExerciseCard";
import { Dumbbell, Pencil, Trash2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface WorkoutDayProps {
  day: DayWorkout;
  onEditExercise?: (dayIndex: number, exerciseIndex: number) => void;
  dayIndex?: number;
  editable?: boolean;
  onEditDay?: () => void;
  onDeleteDay?: () => void;
}

export const WorkoutDay = ({ 
  day, 
  onEditExercise, 
  dayIndex = 0, 
  editable = false,
  onEditDay,
  onDeleteDay 
}: WorkoutDayProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const dayTitle = day.Dia || day.Día || "Día de entrenamiento";
  
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={dayTitle}>
        <AccordionTrigger className="hover:bg-gray-50 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2 text-left">
            <Dumbbell className="h-5 w-5 text-fitBlue-600" />
            <h3 className="text-xl font-semibold">{dayTitle}</h3>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pt-2 pb-4">
          <div className="space-y-4">
            {editable && (
              <div className="flex justify-end gap-2 mb-4">
                {onEditDay && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onEditDay}
                    className="text-blue-600"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Editar día
                  </Button>
                )}
                {onDeleteDay && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar día
                  </Button>
                )}
              </div>
            )}
            {day.Ejercicios.map((exercise, index) => (
              <ExerciseCard 
                key={index} 
                exercise={exercise} 
                onEdit={editable && onEditExercise ? () => onEditExercise(dayIndex, index) : undefined}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el día de entrenamiento y todos sus ejercicios.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDeleteDay?.();
                setIsDeleteDialogOpen(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Accordion>
  );
};
