
import { ExerciseData } from "@/types/workout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Pencil, Timer, ListOrdered } from "lucide-react";

interface ExerciseCardProps {
  exercise: ExerciseData;
  onEdit?: () => void;
}

export const ExerciseCard = ({ exercise, onEdit }: ExerciseCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-4 px-6">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-xl">{exercise.Ejercicio}</CardTitle>
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit} className="shrink-0">
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-6">
        {exercise.Anotaciones && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Info className="h-4 w-4 text-blue-600" />
              Anotaciones:
            </div>
            <p className="text-sm text-gray-600">{exercise.Anotaciones}</p>
          </div>
        )}

        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-blue-600 shrink-0" />
            <div className="flex gap-2 items-center text-sm">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {exercise.SeriesPrevias} series previas
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {exercise.Descanso} descanso
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <ListOrdered className="h-4 w-4 text-blue-600" />
              Series:
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm">
                <span className="block text-xs text-gray-500">Serie 1</span>
                {exercise.PrimeraSerie}
              </div>
              <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm">
                <span className="block text-xs text-gray-500">Serie 2</span>
                {exercise.SegundaSerie}
              </div>
              <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm">
                <span className="block text-xs text-gray-500">Serie 3</span>
                {exercise.TerceraSerie}
              </div>
            </div>
          </div>

          {exercise.RIR && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">RIR:</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                {exercise.RIR}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
