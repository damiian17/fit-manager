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
  
  const extractDayName = (day: any): string => {
    if (day.Día && typeof day.Día === 'string') {
      return day.Día;
    }
    
    for (const key in day) {
      if (key !== 'Ejercicios') {
        if (key.startsWith('Día') && key.includes(':')) {
          const parts = key.split(':');
          if (parts.length > 1) {
            return parts[1].trim();
          }
        } else if (key.startsWith('Día')) {
          const parts = key.split(' ');
          if (parts.length > 2) {
            return parts.slice(2).join(' ');
          }
        }
      }
    }
    
    return '';
  };
  
  const dayName = extractDayName(day);
  const dayTitle = dayName ? `Día ${dayIndex + 1} - ${dayName}` : `Día ${dayIndex + 1}`;
  const ejercicios = day.Ejercicios || [];
  
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={dayTitle}>
        <AccordionTrigger className="hover:bg-gray-50 px-4 py-4 rounded-lg">
          <div className="flex items-center gap-3">
            <Dumbbell className="h-5 w-5 text-fitBlue-600 shrink-0" />
            <h3 className="text-xl font-semibold">{dayTitle}</h3>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pt-4 pb-6">
          <div className="space-y-6">
            {editable && (
              <div className="flex justify-end gap-2">
                {onEditDay && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onEditDay}
                    className="text-blue-600"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
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
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar día
                  </Button>
                )}
              </div>
            )}
            {Array.isArray(ejercicios) && ejercicios.length > 0 ? (
              <div className="grid gap-6">
                {ejercicios.map((exercise, index) => (
                  <ExerciseCard 
                    key={index} 
                    exercise={exercise} 
                    onEdit={editable && onEditExercise ? () => onEditExercise(dayIndex, index) : undefined}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No hay ejercicios disponibles para este día
              </p>
            )}
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
