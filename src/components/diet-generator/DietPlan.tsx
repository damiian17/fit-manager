
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebhookResponse, DailyMeal } from "@/types/diet";
import { RotateCcw, Save } from "lucide-react";

interface DietPlanProps {
  webhookResponse: WebhookResponse;
  selectedOption: string;
  clientInfo: {
    id: string;
    name: string;
    dietName: string;
  };
  onOptionChange: (option: string) => void;
  onReset: () => void;
  onSave: () => void;
}

export const DietPlan = ({ 
  webhookResponse, 
  selectedOption, 
  clientInfo,
  onOptionChange, 
  onReset, 
  onSave 
}: DietPlanProps) => {
  const [activeTab, setActiveTab] = useState(selectedOption || webhookResponse[0]?.dia || "Lunes");
  
  // Handle option change
  const handleOptionChange = (value: string) => {
    setActiveTab(value);
    onOptionChange(value);
  };

  // Get the selected daily meal
  const selectedDay = webhookResponse.find(day => day.dia === activeTab);
  
  if (!webhookResponse || webhookResponse.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-medium text-red-600">Error en los datos</h3>
            <p className="mt-2 text-gray-500">No se pudo procesar correctamente la información de la dieta.</p>
            <Button variant="outline" onClick={onReset} className="mt-4">
              <RotateCcw className="mr-2 h-4 w-4" />
              Volver al formulario
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Plan Dietético: {clientInfo.dietName}</CardTitle>
              <CardDescription>
                {clientInfo.name ? `Cliente: ${clientInfo.name}` : "Cliente sin nombre"} | 
                Calorías objetivo: {selectedDay?.kcalObjetivo || "N/A"} kcal
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={onReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reiniciar
              </Button>
              <Button size="sm" onClick={onSave}>
                <Save className="mr-2 h-4 w-4" />
                Guardar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={handleOptionChange}>
              <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
                {webhookResponse.map((day) => (
                  <TabsTrigger key={day.dia} value={day.dia}>
                    {day.dia}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {webhookResponse.map((day) => (
                <TabsContent key={day.dia} value={day.dia} className="space-y-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
