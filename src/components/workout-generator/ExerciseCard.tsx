
import { ExerciseData } from "@/types/workout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Info, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExerciseCardProps {
  exercise: ExerciseData;
  onEdit?: () => void;
}

export const ExerciseCard = ({ exercise, onEdit }: ExerciseCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 py-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{exercise.Ejercicio}</CardTitle>
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit} className="text-fitBlue-600">
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-fitBlue-600" />
                <h4 className="text-sm font-medium">Anotaciones:</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{exercise.Anotaciones}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-fitBlue-50 text-fitBlue-700">
                Series previas: {exercise.SeriesPrevias}
              </Badge>
              <Badge variant="outline" className="bg-fitBlue-50 text-fitBlue-700 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {exercise.Descanso}
              </Badge>
            </div>
            
            <div className="space-y-1 mt-2">
              <p className="text-sm"><span className="font-medium">Serie 1:</span> {exercise.PrimeraSerie}</p>
              <p className="text-sm"><span className="font-medium">Serie 2:</span> {exercise.SegundaSerie}</p>
              <p className="text-sm"><span className="font-medium">Serie 3:</span> {exercise.TerceraSerie}</p>
              <p className="text-sm"><span className="font-medium">RIR:</span> {exercise.RIR}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
