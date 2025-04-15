
import { Diet } from "@/services/supabaseService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DailyMeal } from "@/types/diet";

interface DietCardProps {
  diet: Diet;
  onViewDetails: (diet: Diet) => void;
}

export const DietCard = ({ diet, onViewDetails }: DietCardProps) => {
  const formattedDate = diet.created_at 
    ? format(new Date(diet.created_at), "d 'de' MMMM, yyyy", { locale: es })
    : "Fecha desconocida";

  // Determine diet format and extract total calories
  const dietData = Array.isArray(diet.diet_data) ? diet.diet_data : [];
  const isNewFormat = dietData.length > 0 && 'dia' in dietData[0];
  
  let totalCalories: string | number = "N/A";
  
  if (isNewFormat) {
    // New format
    const firstDay = dietData[0] as DailyMeal;
    totalCalories = firstDay.kcalObjetivo;
  } else {
    // Old format
    totalCalories = dietData.find(
      (item: any) => item.tipo === 'Resumen'
    )?.caloriasTotalesDiariasObjetivo || "N/A";
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{diet.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <CalendarDays className="h-3 w-3 mr-1" />
              {formattedDate}
            </CardDescription>
          </div>
          <Badge>
            {totalCalories !== "N/A" ? `${totalCalories} kcal` : "Plan dietético"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {isNewFormat 
              ? `${dietData.length} días de dieta` 
              : `${dietData.filter((item: any) => item.opcion).length} opciones disponibles`}
          </p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center text-fitBlue-600"
            onClick={() => onViewDetails(diet)}
          >
            Ver detalles
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
