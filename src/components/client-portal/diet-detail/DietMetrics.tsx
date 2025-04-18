
import { DailyMeal } from "@/types/diet";

interface DietMetricsProps {
  day: DailyMeal;
}

export const DietMetrics = ({ day }: DietMetricsProps) => {
  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mt-4">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="font-medium">Calorías totales:</span> {day.kcalTotales} kcal
        </div>
        <div>
          <span className="font-medium">Objetivo diario:</span> {day.kcalObjetivo} kcal
        </div>
        <div className="col-span-2">
          <span className="font-medium">Variación calórica:</span> {day.variacion}
        </div>
      </div>
    </div>
  );
};
