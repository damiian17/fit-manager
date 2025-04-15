
import { Diet } from "@/services/supabaseService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { DailyMeal } from "@/types/diet";
import { toast } from "sonner";

interface DietDetailViewProps {
  diet: Diet;
  onBack: () => void;
}

export const DietDetailView = ({ diet, onBack }: DietDetailViewProps) => {
  const [dietData, setDietData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    
    // Process diet data from the diet prop
    if (diet && diet.diet_data) {
      // Ensure diet_data is an array
      const data = Array.isArray(diet.diet_data) ? diet.diet_data : [];
      setDietData(data);
    } else {
      console.error("No diet data available:", diet);
      toast.error("No se pudieron cargar los datos de la dieta");
    }
    
    setIsLoading(false);
  }, [diet]);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Button variant="ghost" onClick={onBack} className="w-fit p-0 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <CardTitle>{diet.name}</CardTitle>
          <CardDescription>Cargando datos de la dieta...</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  // Handle empty data
  if (dietData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <Button variant="ghost" onClick={onBack} className="w-fit p-0 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <CardTitle>{diet.name}</CardTitle>
          <CardDescription>No hay datos disponibles para esta dieta</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Check if this is the new format (contains "dia" property)
  const isNewFormat = 'dia' in dietData[0];
  
  if (isNewFormat) {
    // New format handling (per day)
    const dailyMeals = dietData as DailyMeal[];
    const [activeTab, setActiveTab] = useState(dailyMeals[0]?.dia || "");

    return (
      <Card>
        <CardHeader>
          <Button variant="ghost" onClick={onBack} className="w-fit p-0 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <CardTitle>{diet.name}</CardTitle>
          <CardDescription>
            Plan dietético personalizado de {dailyMeals.length} días
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
              {dailyMeals.map((day) => (
                <TabsTrigger key={day.dia} value={day.dia}>
                  {day.dia}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {dailyMeals.map((day) => (
              <TabsContent key={day.dia} value={day.dia} className="space-y-6">
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
                
                <div className="space-y-6">
                  {Object.entries(day)
                    .filter(([key]) => key.startsWith('comida') && day[key as keyof DailyMeal])
                    .map(([mealKey, meal]) => {
                      if (!meal) return null;
                      
                      return (
                        <Card key={mealKey}>
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
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    );
  } else {
    // Handle old format for backward compatibility
    const dietOptions = dietData.filter(item => 'opcion' in item);
    const summaryItem = dietData.find(item => 'tipo' in item && item.tipo === 'Resumen');
    const [activeTab, setActiveTab] = useState(dietOptions[0]?.opcion || "");
    
    return (
      <Card>
        <CardHeader>
          <Button variant="ghost" onClick={onBack} className="w-fit p-0 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <CardTitle>{diet.name}</CardTitle>
          <CardDescription>
            {summaryItem ? `Calorías objetivo: ${summaryItem.caloriasTotalesDiariasObjetivo} kcal` : 'Plan dietético personalizado'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
              {dietOptions.map((option: any) => (
                <TabsTrigger key={option.opcion} value={option.opcion}>
                  {option.opcion}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {dietOptions.map((option: any) => (
              <TabsContent key={option.opcion} value={option.opcion} className="space-y-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mt-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Calorías totales:</span> {option.caloriasTotalesDia} kcal
                    </div>
                    <div>
                      <span className="font-medium">Objetivo diario:</span> {option.caloriasDiariasObjetivo} kcal
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Variación calórica:</span> {option.variacionCalorica}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {Object.keys(option.recetasSeleccionadas || {}).map((mealKey) => {
                    const meal = option.recetasSeleccionadas[mealKey];
                    if (!meal) return null;
                    
                    return (
                      <Card key={mealKey}>
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">{meal.nombre}</CardTitle>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded dark:bg-blue-900 dark:text-blue-300">
                              {meal.kcals} kcal
                            </span>
                          </div>
                          <CardDescription>{meal.tipo}</CardDescription>
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
                                {(meal.gruposAlimentos || "").split(', ').map((grupo: string, index: number) => (
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
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    );
  }
};
