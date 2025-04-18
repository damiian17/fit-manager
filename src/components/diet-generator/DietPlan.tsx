
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebhookResponse, DailyMeal } from "@/types/diet";
import { RotateCcw, Save, Edit } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MealEditor } from "./MealEditor";

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
  onEditMeal?: (day: string, mealKey: string, meal: any) => void;
  dietId?: string;
}

export const DietPlan = ({ 
  webhookResponse, 
  selectedOption, 
  clientInfo,
  onOptionChange, 
  onReset, 
  onSave,
  onEditMeal,
  dietId
}: DietPlanProps) => {
  const [activeTab, setActiveTab] = useState(selectedOption || webhookResponse[0]?.dia || "Lunes");
  const isMobile = useIsMobile();
  const [editingMeal, setEditingMeal] = useState<{
    open: boolean;
    day: string;
    mealKey: string;
    meal: any;
  }>({
    open: false,
    day: "",
    mealKey: "",
    meal: null
  });
  const [localWebhookResponse, setLocalWebhookResponse] = useState<WebhookResponse>(webhookResponse);
  
  const handleOptionChange = (value: string) => {
    setActiveTab(value);
    onOptionChange(value);
  };

  const handleEditMeal = (day: string, mealKey: string, meal: any) => {
    if (onEditMeal) {
      onEditMeal(day, mealKey, meal);
    } else if (dietId) {
      // If we have a dietId, we can edit directly
      setEditingMeal({
        open: true,
        day,
        mealKey,
        meal
      });
    }
  };

  const handleMealUpdated = async () => {
    // Refresh the data if needed
    if (dietId) {
      // If we're editing an existing diet, we'd need to reload it
      // For now, we'll just update the local state
      setEditingMeal(prev => ({ ...prev, open: false }));
    }
  };

  const selectedDay = localWebhookResponse.find(day => day.dia === activeTab);
  
  if (!localWebhookResponse || localWebhookResponse.length === 0) {
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
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <Button variant="ghost" onClick={onReset} className="w-fit p-0 mb-2">
                <RotateCcw className="mr-2 h-4 w-4" />
                Volver
              </Button>
              <CardTitle className="text-xl sm:text-2xl">{clientInfo.dietName}</CardTitle>
              <CardDescription>
                {clientInfo.name ? `Cliente: ${clientInfo.name}` : "Cliente sin nombre"} | 
                Calorías objetivo: {selectedDay?.kcalObjetivo || "N/A"} kcal
              </CardDescription>
            </div>
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={onReset}>
                <RotateCcw className="h-4 w-4" />
                {!isMobile && <span className="ml-2">Reiniciar</span>}
              </Button>
              <Button size={isMobile ? "sm" : "default"} onClick={onSave}>
                <Save className="h-4 w-4" />
                {!isMobile && <span className="ml-2">Guardar</span>}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={handleOptionChange}>
              <div className="overflow-x-auto pb-2">
                <TabsList className="w-full flex flex-nowrap">
                  {localWebhookResponse.map((day) => (
                    <TabsTrigger 
                      key={day.dia} 
                      value={day.dia}
                      className="flex-1 min-w-[80px] text-xs sm:text-sm px-2 py-1.5"
                    >
                      {day.dia}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {localWebhookResponse.map((day) => (
                <TabsContent key={day.dia} value={day.dia} className="space-y-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Calorías totales:</span> {day.kcalTotales} kcal
                      </div>
                      <div>
                        <span className="font-medium">Objetivo diario:</span> {day.kcalObjetivo} kcal
                      </div>
                      <div className="col-span-1 sm:col-span-2">
                        <span className="font-medium">Variación calórica:</span> {day.variacion}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {Object.entries(day)
                      .filter(([key]) => key.startsWith('comida') && day[key as keyof DailyMeal])
                      .map(([mealKey, meal]) => {
                        if (!meal) return null;
                        
                        return (
                          <Card key={mealKey}>
                            <CardHeader className="py-3">
                              <div className="flex justify-between items-center">
                                <div>
                                  <CardTitle className="text-base sm:text-lg">{meal.nombre}</CardTitle>
                                  <CardDescription>Comida {mealKey.replace('comida', '')}</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded dark:bg-blue-900 dark:text-blue-300">
                                    {meal.kcals} kcal
                                  </span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleEditMeal(day.dia, mealKey, meal)}
                                    className="text-fitBlue-600"
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Editar
                                  </Button>
                                </div>
                              </div>
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
      
      {editingMeal.open && dietId && (
        <MealEditor
          open={editingMeal.open}
          onClose={() => setEditingMeal(prev => ({ ...prev, open: false }))}
          meal={editingMeal.meal}
          mealKey={editingMeal.mealKey}
          day={editingMeal.day}
          dietId={dietId}
          dietData={localWebhookResponse}
          onMealUpdated={handleMealUpdated}
        />
      )}
    </div>
  );
};
