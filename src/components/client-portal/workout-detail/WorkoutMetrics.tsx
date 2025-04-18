
import { BarChart3, Clock, Calendar } from "lucide-react";

interface WorkoutMetricsProps {
  workoutType: string;
  duration: string;
  level: string;
  goal: string;
}

export const WorkoutMetrics = ({
  workoutType,
  duration,
  level,
  goal
}: WorkoutMetricsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center">
        <BarChart3 className="h-5 w-5 mr-2 text-fitBlue-600" />
        <div>
          <p className="text-xs text-gray-500">Tipo</p>
          <p className="font-medium">{workoutType}</p>
        </div>
      </div>
      <div className="flex items-center">
        <Clock className="h-5 w-5 mr-2 text-fitBlue-600" />
        <div>
          <p className="text-xs text-gray-500">Duración</p>
          <p className="font-medium">{duration}</p>
        </div>
      </div>
      <div className="flex items-center">
        <Calendar className="h-5 w-5 mr-2 text-fitBlue-600" />
        <div>
          <p className="text-xs text-gray-500">Nivel</p>
          <p className="font-medium">{level}</p>
        </div>
      </div>
      <div className="flex items-center">
        <Calendar className="h-5 w-5 mr-2 text-fitBlue-600" />
        <div>
          <p className="text-xs text-gray-500">Objetivo</p>
          <p className="font-medium">{goal}</p>
        </div>
      </div>
    </div>
  );
};
