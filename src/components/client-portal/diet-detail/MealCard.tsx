
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface MealCardProps {
  meal: {
    nombre: string;
    kcals: number;
    ingredientes: string;
    grupos: string;
  };
  mealKey: string;
}

export const MealCard = ({ meal, mealKey }: MealCardProps) => {
  return (
    <Card>
      <CardHeader className="py-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{meal.nombre}</CardTitle>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded dark:bg-blue-900 dark:text-blue-300">
            {meal.kcals} kcal
          </span>
        </div>
        <CardDescription>Comida {mealKey.replace('comida', '')}</CardDescription>
      </CardHeader>
      <CardContent className="py-3">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-1">Ingredientes:</h4>
            <div className="text-sm whitespace-pre-line">
              {meal.ingredientes}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-1">Grupos de alimentos:</h4>
            <div className="flex flex-wrap gap-1">
              {meal.grupos.split(', ').map((grupo, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded dark:bg-gray-800 dark:text-gray-200"
                >
                  {grupo}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
