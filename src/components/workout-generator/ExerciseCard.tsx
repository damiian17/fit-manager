
import { ExerciseData } from "@/types/workout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Info } from "lucide-react";

interface ExerciseCardProps {
  exercise: ExerciseData;
}

export const ExerciseCard = ({ exercise }: ExerciseCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 py-3">
        <CardTitle className="text-lg">{exercise.Ejercicio}</CardTitle>
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
