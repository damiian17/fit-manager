
import { Diet } from "@/services/supabaseService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

interface DietDetailViewProps {
  diet: Diet;
  onBack: () => void;
}

export const DietDetailView = ({ diet, onBack }: DietDetailViewProps) => {
  // Ensure we have diet_data and it's an array
  const dietData = Array.isArray(diet.diet_data) ? diet.diet_data : [];
  
  // Find the summary item
  const summaryItem = dietData.find(item => 'tipo' in item && item.tipo === 'Resumen');
  
  // Get diet options (filter out the summary)
  const dietOptions = dietData.filter(item => 'opcion' in item);
  
  const [activeTab, setActiveTab] = useState(dietOptions[0]?.opcion || "");

  // If no data available
  if (!dietOptions.length) {
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

  const selectedDiet = dietOptions.find(option => option.opcion === activeTab);

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
            {dietOptions.map((option) => (
              <TabsTrigger key={option.opcion} value={option.opcion}>
                {option.opcion}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {dietOptions.map((option) => (
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
};
