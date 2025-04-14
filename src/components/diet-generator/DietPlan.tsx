
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { FileDown, Mail, Salad, Utensils, Calendar, PieChart, BarChart3 } from "lucide-react";
import { WebhookResponse, DietOption, SummaryItem, DietSummary } from "@/types/diet";
import { useEffect } from "react";

interface DietPlanProps {
  webhookResponse: WebhookResponse | null;
  selectedOption: string;
  onOptionChange: (option: string) => void;
  onReset: () => void;
  onSave: () => void;
}

export const DietPlan = ({ webhookResponse, selectedOption, onOptionChange, onReset, onSave }: DietPlanProps) => {
  // Debug logging
  useEffect(() => {
    console.log("DietPlan component received webhookResponse:", webhookResponse);
    console.log("Selected option:", selectedOption);
  }, [webhookResponse, selectedOption]);

  if (!webhookResponse || webhookResponse.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div>No hay datos disponibles para mostrar</div>
          <Button variant="outline" onClick={onReset} className="mt-4">
            Volver al formulario
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Get diet options (exclude the summary)
  const dietOptions = webhookResponse.filter(item => 'opcion' in item) as DietOption[];
  
  // Get the selected diet option
  const selectedDietOption = dietOptions.find(item => item.opcion === selectedOption);
  
  // Get the summary data
  const summaryData = webhookResponse.find(item => 'tipo' in item && item.tipo === "Resumen") as DietSummary | undefined;

  if (!selectedDietOption) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div>Opción de dieta no encontrada. Por favor, seleccione otra opción.</div>
          <div className="mt-4">
            <Tabs value={dietOptions[0]?.opcion || ""} onValueChange={onOptionChange} className="w-full">
              <TabsList className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 mb-4">
                {dietOptions.map((option) => (
                  <TabsTrigger key={option.opcion} value={option.opcion}>
                    {option.opcion}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <Button variant="outline" onClick={onReset} className="mt-4">
            Volver al formulario
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Convert the selected diet option's recipes to an array for easier rendering
  const mealsArray = Object.entries(selectedDietOption.recetasSeleccionadas).map(([key, recipe]) => ({
    id: key,
    name: recipe.nombre,
    ingredients: recipe.ingredientes,
    calories: recipe.kcals,
    foodGroups: recipe.gruposAlimentos,
    type: recipe.tipo,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Plan Dietético Personalizado</CardTitle>
            <CardDescription>
              {summaryData ? `Calorías diarias objetivo: ${summaryData.caloriasTotalesDiariasObjetivo} kcal` : 
                `Calorías diarias objetivo: ${selectedDietOption.caloriasDiariasObjetivo} kcal`}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-fitGreen-50 border border-fitGreen-100 rounded-lg">
            <h3 className="font-semibold text-fitGreen-800 mb-2">Resumen Nutricional</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-xl font-bold text-fitGreen-600">{selectedDietOption.caloriasTotalesDia}</div>
                <div className="text-xs text-gray-500">Calorías Totales</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-xl font-bold text-fitGreen-600">{selectedDietOption.caloriasDiariasObjetivo}</div>
                <div className="text-xs text-gray-500">Calorías Objetivo</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-xl font-bold text-fitGreen-600">{selectedDietOption.variacionCalorica}</div>
                <div className="text-xs text-gray-500">Variación</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-xl font-bold text-fitGreen-600">{Object.keys(selectedDietOption.recetasSeleccionadas).length}</div>
                <div className="text-xs text-gray-500">Comidas</div>
              </div>
            </div>
          </div>
          
          {/* Opciones de dieta */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Opciones de Dieta</h3>
            <Tabs value={selectedOption} onValueChange={onOptionChange} className="w-full">
              <TabsList className="w-full grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 mb-4">
                {dietOptions.map((option) => (
                  <TabsTrigger key={option.opcion} value={option.opcion}>
                    {option.opcion}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          {/* Comidas del día */}
          <div className="space-y-6">
            <h3 className="font-semibold mb-3">Plan Alimentario</h3>
            {mealsArray.map((meal) => (
              <Card key={meal.id} className="overflow-hidden">
                <CardHeader className="bg-fitGreen-50 pb-2">
                  <div className="flex items-center">
                    <Utensils className="h-5 w-5 text-fitGreen-600 mr-2" />
                    <CardTitle className="text-lg">{meal.name}</CardTitle>
                  </div>
                  <CardDescription className="flex flex-wrap gap-4 text-xs mt-1">
                    <span className="font-medium">Tipo: {meal.type}</span>
                    <span>Calorías: {meal.calories}</span>
                    <span>Grupos: {meal.foodGroups}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <h4 className="text-sm font-medium mb-2">Ingredientes:</h4>
                  <div className="whitespace-pre-line text-sm text-gray-600">
                    {meal.ingredients}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold mb-2">Distribución Calórica</h3>
            {selectedDietOption.caloriasObjetivo ? (
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {Object.entries(selectedDietOption.caloriasObjetivo).map(([mealKey, calories]) => (
                  <div key={mealKey} className="text-center p-2 bg-gray-50 rounded border">
                    <div className="text-sm font-medium">{mealKey}</div>
                    <div className="text-lg font-bold text-fitGreen-600">{calories} kcal</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Información de distribución calórica no disponible</p>
            )}
          </div>
          
          {summaryData && (
            <div className="mt-6 p-4 bg-fitGreen-50 border border-fitGreen-100 rounded-lg">
              <h3 className="font-semibold text-fitGreen-800 mb-2">Información Nutricional</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Información General</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Recetas usadas: {summaryData.recetasUsadasTotal}</li>
                    <li>Recetas disponibles: {summaryData.recetasDisponiblesTotal}</li>
                    <li>Calorías diarias: {summaryData.caloriasTotalesDiariasObjetivo}</li>
                    <li>Ingestas configuradas: {summaryData.ingestasConfiguradas.join(", ")}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Distribución Calórica</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {summaryData.distribucionCaloriasBase && Object.entries(summaryData.distribucionCaloriasBase).map(([meal, calories]) => (
                      <li key={meal}>{meal}: {calories} kcal</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex gap-4">
        <Button variant="outline" className="flex-1" onClick={onReset}>
          Modificar parámetros
        </Button>
        <Button className="flex-1 bg-fitGreen-600 hover:bg-fitGreen-700" onClick={onSave}>
          Guardar plan dietético
        </Button>
      </div>
    </div>
  );
};
